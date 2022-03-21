const express = require("express");
const User = require("../../models/Buyer");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var fetchuser = require("../../middleware/fetchUser");
const Buyer = require("../../models/Buyer");  // required for deleting the given buyer 
const Admin = require("../../models/Admin");   // for admin verify
const dotenv = require('dotenv').config()
const jwt_secret = process.env.jwt_secret;

// ROUTE 1: create a user using POST "/api/auth/buyer/signup" (no authentication  required)
router.post(
    "/signup",
    [
        body("name", "Enter  a valid name").isLength({ min: 3 }), // name must be at least 5 chars long
        body("email", "Enter  a valid email").isEmail(),
        body("password", "password must be more than 5 characaters").isLength({ min: 5 })
    ],
    async (req, res) => {
        //If there are validation error, return bad request and errors
        let success = false;
        const errors = validationResult(req);

        const extractedErrors = []
        errors.array().map(err => extractedErrors.push(err.msg))
        console.log(extractedErrors)

        if (!errors.isEmpty()) {
            return res.status(400).json({ success, error: extractedErrors[0] });
        }



        try {

            //Check whether the user with this email exists already
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: "Sorry a user with this email already exists" });
            }
            // genrating salt of lenght 10 for password 
            const salt = await bcrypt.genSalt(10);

            // Hashing(encrypting) a password 
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

            //generating auth token
            const authtoken = jwt.sign(data, jwt_secret);   // generating AUTH-TOKEN for user
            success = true
            res.json({ success, authtoken });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success, error: "Some ERROR occured" });
        }
    }
);

// ROUTE 2: Authenticate a buyer : POST "/api/auth/buyer/login"
router.post(
    "/login",
    [
        body("email", "Enter  a valid email").isEmail(),
        body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {
        //If there are validation error, return bad request and errors
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, error: errors.array() });
        }

        // ideal case : when user gives email and password correctly(in right format as well)
        const { email, password } = req.body;

        try {
            //find the existing user
            let user = await User.findOne({ email });

            if (!user)
                return res.status(400).json({ success, error: "Please try to login using correct credentials" });

            ///comparing the password
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare)
                return res.status(400).json({ success, error: "Please try to login using correct credentials" });

            // if user entered credentials  matches
            const data = {
                user: {
                    id: user.id,
                },
            };
            const authtoken = jwt.sign(data, jwt_secret);   // generating AUTH-TOKEN for user
            success = true
            res.json({ success, authtoken });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success, error: "Internal SERVER error !!!!" });
        }
    }
);

// ROUTE 3: get details of loggedIn  buyer using : POST "/api/auth/buyer/getUser (login required)
router.get("/getUser", fetchuser, async (req, res) => {
    let success = false;
    try {

        const userId = req.user.id
        //finding user with auth token (user id)
        const temp = await User.findById(userId)
        if (temp == null) {
            return res.status(404).json({ success, error: "wrong credentials" });
        }
        //find the existing user 
        const user = await User.findById(userId).select("-password");
        success = true;
        res.json({ success, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal SERVER error !!!!" });
    }
});

// ROUTE 4: update details of buyer  using : PUT"/api/auth/buyer/update (login required)
router.put("/update", fetchuser, async (req, res) => {
    let success = false;

    try {
        const { name } = req.body;
        const UpdatedBuyer = {};
        if (name) {
            if (name.length < 3)
                return res.status(400).json({ success, error: "Enter  a valid name" });

            UpdatedBuyer.name = name
        }

        const userId = req.user.id
        //update and save
        newUser = await User.findByIdAndUpdate(userId, { $set: UpdatedBuyer }, { new: true })
        success = true;
        res.json({ success, newUser });


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal SERVER error !!!!" });
    }
});

// Route - 5 update a buyer Password using : POST "/api/auth/buyer/updatePassword" , login required  
router.put("/updatePassword", fetchuser, async (req, res) => {
    let success = false
    try {
        const { oldPassword, newPassword } = req.body;

        // creating object newAgentDetail
        const newbuyerDetail = {};

        // getting user id from token(using fetchUser middleware)
        const userid = req.user.id;

        // finding admin with  ID(userID)
        let buyer = await User.findById(userid);

        // if any admin is not  found with ID
        if (!buyer) {
            return res.status(400).json({ success, error: "PLease try to login with correct credential" });
        }

        //  if password is passed and to update
        if ((newPassword).length >= 5) {

            // if password is not match with user
            if (bcrypt.compareSync(oldPassword, buyer.password) == false) {
                return res.status(400).json({ success, error: "PLease enter correct Old password" });
            }

            // genrating salt of lenght 10 for password 
            var salt = bcrypt.genSaltSync(10);

            // Hashing(encrypting) a password 
            var password = bcrypt.hashSync(newPassword, salt);

            newbuyerDetail.password = password;
        }
        else {
            return res.status(400).json({ success, error: "Please enter valid  Password" });
        }

        buyer = await User.findByIdAndUpdate(userid, { $set: newbuyerDetail }, { new: true }).select("-password");
        success = true;
        res.json({ success });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Serveral error" });
    }
})

// ROUTE 6:  DELETE "/api/auth/buyer/delete/:id""
router.delete("/delete/:id", fetchuser,
    async (req, res) => {
        let success = false;
        try {

            // now verifying whether the token passed is of any admin or of some other illegal person
            const admin = await Admin.findById(req.user.id);
            if (!admin)
                return res.status(404).json({ success, error: "Operation not allowed !!!" });
            else {

                // now deleting the required buyer by accessing the buyer id via req.params.id
                let BuyerToBeDeleted = req.params.id;
                temp = await Buyer.findById(BuyerToBeDeleted)
                if (temp == null) {
                    return res.status(404).json({ success, error: "Buyer with given id not found" });
                }
                else {
                    success = true;
                    resultOfDeletingBuyer = await Buyer.findByIdAndDelete(BuyerToBeDeleted);
                    return res.status(200).json({ success, message: "Successfully deleted the buyer !" })
                }
            }
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ success, error: "Internal SERVER error !!!!" });
        }
    }
);

//Route 7 :This api to get all user  GET : api/buyer/alluser - login required
router.get('/alluser', async (req, res) => {

    try {
        // find the all apartment of particular seller from database
        const users = await User.find();
        //sent the response to client
        res.json(users)

    } catch (error) {
        //handle the error
        res.status(500).json({ error: "internal server error" });
    }
})

module.exports = router;
