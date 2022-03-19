const express = require("express");
const User = require("../../models/Admin");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var fetchuser = require("../../middleware/fetchUser");
const Complaints = require("../../models/Complaint")
const Admin = require("../../models/Admin")
const dotenv = require('dotenv').config()
const jwt_secret = process.env.jwt_secret;

// ROUTE 1: create a user using POST "/api/auth/admin/signup" (no authentication  required)
router.post(
  "/signup",
  [
    body("name", "Enter  a valid name").isLength({ min: 3 }), // name must be at least 5 chars long
    body("email", "Enter  a valid email").isEmail(),
    body("password", "password must be more than 5 characaters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
     
    let success = false;
    //If there are Validation error, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success , errors: errors.array() });
    }


    try {

      //Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success , error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10); // salt for increased security of password
      secPass = await bcrypt.hash(req.body.password, salt); // secPass = Our secured password hash value(with salt)
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, jwt_secret);   // generating AUTH-TOKEN for user
      success = true;
      res.json({success , authtoken });
    } catch (error) {
      console.error(error);
      res.status(500).json({success , error : "Some ERROR occured"});
    }
  }
);

// ROUTE 2: Authenticate an Admin : POST "/api/auth/admin/login""
router.post(
  "/login",
  [
    body("email", "Enter  a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
     
    let success = false
    //If there are Validation error, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success , errors: errors.array() });
    }

    // ideal case : when user(ADMIN) gives email and password correctly(in right format as well)
    const { email, password } = req.body;

    try {

     //Check whether the user with this email exists 
      let user = await User.findOne({ email });
      if (!user)  // if login credentials are wrong !
        return res.status(400).json({success , error: "Please try to login using correct credentials" });

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare)  // if password doesn't matches !
        return res.status(400).json({success , error: "Please try to login using correct credentials" });
      
        // if user credentials matches
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_secret);   // generating AUTH-TOKEN for user
      success = true;
      res.json({ success  , authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({success ,error : "Internal SERVER error !!!!"});
    }
  }
);

// ROUTE 3: get details of loggedIn  admin using : POST "/api/auth/admin/getUser (login required)
router.get("/getUser", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id
    
     const temp = await User.findById(userId)
      if (temp == null) {
          return res.status(404).json({success, error:"wrong credentials"});
      }

    //finding admin with this id 
    const user = await User.findById(userId).select("-password");
    success = true;
    res.json({success, user});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({success, error:"Internal SERVER error !"});
  }
});


// ROUTE 4: update details of admin  using : PUT : "/api/auth/admin/update  (login required)
router.put("/update", fetchuser, async (req, res) => {
  let success = false;
  try {
    const { name, email } = req.body;
    const UpdatedBuyer = {};
    if (name) { 
      if(name.length < 3)
         return res.status(400).json({success, errors: "Enter  a valid name" });

         UpdatedBuyer.name = name
    }

    // if (email) { UpdatedBuyer.email = email }
    const userId = req.user.id

    // find with id and update it
    newUser = await User.findByIdAndUpdate(userId, { $set: UpdatedBuyer }, {new:true})
    success = true;
    res.json({success, newUser});

  } catch (error) {
    console.error(error.message);
    res.status(500).json({success, error:"Internal SERVER error !"});
  }
});

// Route - 5 update a Admin Password using : POST "/api/auth/admin/updatePassword" , login required  
router.put("/updatePassword", fetchuser, async (req, res) => {
  let success = false;
  try {

      const { oldPassword, newPassword } = req.body;

      // creating object newAgentDetail
      const newAdminDetail = {};

      // getting user id from token(using fetchUser middleware)
      const userid = req.user.id;

      // finding admin with  ID(userID)
      let admin = await User.findById(userid);

      // if any admin is not  found with ID
      if (!admin) {
          return res.status(400).json({success, error: "PLease try to login with correct credential" });
      }

      //  if password is passed and to update
      if ((newPassword).length >= 5) {

          // if password is not match with user
          if (bcrypt.compareSync(oldPassword, admin.password) == false) {
              return res.status(400).json({success, error: "PLease enter correct Old password" });
          }

          // genrating salt of lenght 10 for password 
          var salt = bcrypt.genSaltSync(10);

          // Hashing(encrypting) a password 
          var password = bcrypt.hashSync(newPassword, salt);

          newAdminDetail.password = password;
      }
      else {
          return res.status(400).json({success, errors: "Please enter valid  Password" });
      }

      agent = await User.findByIdAndUpdate(userid, { $set: newAdminDetail }, { new: true }).select("-password");
      success = true;
      res.json({success, message:"Your password is succesfully updated"});

  } catch (error) {
      console.error(error.message);
      res.status(500).json({success, error:"Internal Serveral error"});
  }
})


module.exports = router;
