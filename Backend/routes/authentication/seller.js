const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const fetchUser = require('../../middleware/fetchUser')
const Apartment = require('../../models/Apartment')
const User = require('../../models/Seller');
const dotenv = require('dotenv').config()
const jwt_secret = process.env.jwt_secret;

//Route 1 : This api to create new user(Seller) using POST api/auth/seller/signup , and here no login required 
router.post('/signup', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('password', 'Password must be atleast 5 characters ').isLength({ min: 5 }),
  body('email', 'Enter a valid email id').isEmail()
], async (req, res) => {

  //this is to confirm whether signup is successfully done or not.
  let success = false;

  //validate to the user data 
  const errors = validationResult(req);

  //if the user data is not as we expect then we will return the error message with 400 status code.
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, error: errors.array() });
  }

  // Get user input
  const { name, email, password } = req.body;

  //checking into the database => this user already exist or not.
  let user = await User.findOne({ email: email });

  //if the user already exist then we will return error message with 400 status code 
  if (user) {
    return res.status(400).json({ success, error: "This email id already exist! Please try to login" })
  }

  try {

    //salt generating of length 10
    const salt = await bcrypt.genSalt(10)

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, salt);

    //Create user in our database
    user = await User.create({
      name: name,
      password: encryptedPassword,
      email: email,
    })

    //we reach here its mean that we have done signup successfully.so that signupSuccess = true
    success = true;
    const data = {
      user: {
        id: user._id
      }
    }
    //Create   token 
    const authtoken = jwt.sign(data, jwt_secret);
    res.json({ success, authtoken })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success, error: "Some error occured" })
  }
})


//Router 2 : This api to Login user(Seller) using POST api/auth/seller/login , and here no login required 
router.post('/login', [
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  body('email', 'Enter a valid email id').isEmail()
], async (req, res) => {
  let success = false;

  //validate to the user data 
  const errors = validationResult(req);

  //if the user data is not as we expect then we will retuen the error message with 400 status code.
  if (!errors.isEmpty()) {

    return res.status(400).json({ success, error: errors.array() });
  }

  // Get user input
  const { email, password } = req.body;

  try {

    //get user credentials from database & // Validate if user exist in our database
    let user = await User.findOne({ email });

    //if the user does not exist then we will return error message with 400 status code
    if (!user) {
      return res.status(400).json({ success, error: "please try to login with correct credentails" })
    }

    //match the password 
    const passwordCompare = await bcrypt.compare(password, user.password);

    //if the password not match then we will return 400 status code
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "please try to login with correct credentails" })
    }

    const data = {
      user: {
        id: user._id
      }
    }

    // JWT to sign the credentials
    const authtoken = jwt.sign(data, jwt_secret);

    success = true;  //login is successfully done
    res.json({ success, authtoken })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success, error: "Invalid Credentials" })
  }
})

//Router 3 :Get user details using jwt token GET : api/auth/seller/getUser - Login required
router.get('/getUser', fetchUser, async (req, res) => {
  let success = false;
  try {
    //get the user id 
    const userId = req.user.id;

    //finding user with auth token (user id)
    const temp = await User.findById(userId)

    if (temp === null) {
      return res.status(404).json({ success, error: "wrong credentials" });
    }

    //get all the details about the user except password
    const user = await User.findById(userId).select("-password");

    success = true;
    res.json({ success, user });


  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success, error: "internal server error" });
  }

})


//Router 4 : Update user details using PUT : api/auth/seller/update - Login required
router.put('/update', fetchUser, async (req, res) => {
  let success = false;
  try {
    //get the user id 
    const userId = req.user.id;

    //removes whitespace from both ends of a string and returns a new string.
    let updatedName = req.body.name.trim();

    //get all the data about the user
    let user = await User.findById(userId).select("-password")

    if (!user) {
      //user is not present into database.
      return res.status(404).json({ success, error: "this user not found" });
    }

    if (updatedName) {
      if (updatedName.length < 3)
        return res.status(400).json({ success, error: "Enter  a valid name" });
      user.name = updatedName
    }

    //save the updated data 
    let updatedUser = await user.save();

    success = true
    //return res with updated user
    res.json({ success, updatedUser });

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ success, error: "internal server error-" });
  }

})


//Router 5 : Update user Password using PUT : api/auth/seller/updatePassword - Login required
router.put('/updatePassword', fetchUser, async (req, res) => {
  let success = false;
  try {
    //get the user id 
    const userId = req.user.id;

    //get the old and new password value
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    //finding the user with id
    let user = await User.findById(userId)

    if (!user) {
      //user is not present into database.
      return res.status(404).json({ success, eroor: "this user not found" });
    }

    //match the password 
    const passwordCompare = await bcrypt.compare(oldPassword, user.password);

    //if the password not match then we will return 400 status code
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please enter the correct old password" })
    }

    //generate salt
    const salt = await bcrypt.genSalt(10)

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(newPassword, salt);
    user.password = encryptedPassword;

    //save the updated data 
    let updatedUser = await user.save()

    success = true;
    //return res with updated user
    res.json({ success, message: "Passwrd has been successfully updated" });

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ success, error: "internal server error" });
  }

})

//Router 6 : Delete user  using DELETE : api/auth/seller/delete - Login required
router.delete('/delete/:id', fetchUser, async (req, res) => {
  //getting id of the user whose Admin want to delete.
  let success = false;
  const deleteUserId = req.params.id;
  try {
    //find user from the database
    let user = await User.findById(deleteUserId);
    if (!user) {
      return res.status(404).json({ success, error: "Not found" });
    }

    // getting all the apartment of user 
    const userApartment = await Apartment.find({ seller: deleteUserId })

    //deleting all user's apartment
    for (var i = 0; i < userApartment.length; i++) {
      let deletedApartment = await Apartment.findByIdAndDelete(userApartment[i]._id)
    }

    //deleting the user
    const updatedUser = await User.findByIdAndDelete(deleteUserId)
    success = true;
    res.json({ success, "message": "User has been successfully deleted" });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success, error: "internal server error-" });
  }

})

//Route 7 :This api to get all user  GET : api/seller/alluser - login required
router.get('/alluser', async (req, res) => {

  try {
    // find the all sellers
    const users = await User.find();
    //sent the response to client
    res.json(users)

  } catch (error) {
    //handle the error
    res.status(500).json({ error: "internal server error" });
  }
})


//Router 8 : get seller details using GET : api/auth/seller/:id - Login required
router.get("/getseller/:id",
  async (req, res) => {

    try {

      let SellerToBeFound = req.params.id;
      temp = await User.findById(SellerToBeFound)
      if (temp == null) {
        res.status(404).json({ success: false, error: "Seller does not exists" });
      }
      else {
        resultOffindSeller = await User.findById(SellerToBeFound)
        res.status(200).json({ success: true, user: resultOffindSeller });

      }

    }
    catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, error: "Internal SERVER error !!!!" });
    }
  }
);

module.exports = router;


