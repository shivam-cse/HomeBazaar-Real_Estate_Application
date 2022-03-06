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
  let signupSuccess = false;

  //validate to the user data 
  const errors = validationResult(req);

  //if the user data is not as we expect then we will return the error message with 400 status code.
  if (!errors.isEmpty()) {
    return res.status(400).json({ signupSuccess, errors: errors.array() });
  }

  // Get user input
  const { name, email, password } = req.body;

  //checking into the database => this user already exist or not.
  let user = await User.findOne({ email: email });

  //if the user already exist then we will return error message with 400 status code 
  if (user) {
    return res.status(400).json({ signupSuccess, error: "This email id already exist! Please try to login" })
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
    signupSuccess = true;
    const data = {
      user: {
        id: user._id
      }
    }
    //Create   token 
    const authToken = jwt.sign(data, jwt_secret);
    res.json({ signupSuccess, authToken })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Some error occured" })
  }
})


//Router 2 : This api to Login user(Seller) using POST api/auth/seller/login , and here no login required 
router.post('/login', [
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  body('email', 'Enter a valid email id').isEmail()
], async (req, res) => {

  //validate to the user data 
  const errors = validationResult(req);

  //if the user data is not as we expect then we will retuen the error message with 400 status code.
  if (!errors.isEmpty()) {
    let loginSuccess = false;
    return res.status(400).json({ loginSuccess, errors: errors.array() });
  }

  // Get user input
  const { email, password } = req.body;

  try {
    let loginSuccess = false;

    //get user credentials from database & // Validate if user exist in our database
    let user = await User.findOne({ email });

    //if the user does not exist then we will return error message with 400 status code
    if (!user) {
      return res.status(400).json({ loginSuccess, error: "please try to login with correct credentails" })
    }

    //match the password 
    const passwordCompare = await bcrypt.compare(password, user.password);

    //if the password not match then we will return 400 status code
    if (!passwordCompare) {
      return res.status(400).json({ loginSuccess, error: "please try to login with correct credentails" })
    }

    const data = {
      user: {
        id: user._id
      }
    }

    // JWT to sign the credentials
    const authToken = jwt.sign(data, jwt_secret);

    loginSuccess = true;  //login is successfully done
    res.json({ loginSuccess, authToken })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Invalid Credentials" })
  }
})

//Router 3 : Get user details using jwt token POST : api/auth/seller/getUser - Login required
router.post('/getUser', fetchUser, async (req, res) => {
  try {
    //get the user id 
    const userId = req.user.id;

    //get all the details about the user except password
    const user = await User.findById(userId).select("-password");

    res.json({ user });

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ error: "internal server error-" });
  }

})


//Router 4 : Update user details using PUT : api/auth/seller/update - Login required
router.put('/update', fetchUser, async (req, res) => {
  try {
    //get the user id 
    const userId = req.user.id;

    //removes whitespace from both ends of a string and returns a new string.
    let updatedName = req.body.name.trim();

    //get all the data about the user
    let user = await User.findById(userId).select("-password")

    if (!user) {
      //user is not present into database.
      return res.status(404).send("this user not found");
    }

    if (updatedName) {
      if (updatedName.length < 3)
        return res.status(400).json({ errors: "Enter  a valid name" });
      user.name = updatedName
    }

    //save the updated data 
    let updatedUser = await user.save();

    //return res with updated user
    res.json({ updatedUser });

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ error: "internal server error-" });
  }

})


//Router 5 : Update user Password using PUT : api/auth/seller/updatePassword - Login required
router.put('/updatePassword', fetchUser, async (req, res) => {
  let updateSuccess = false;
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
      return res.status(404).json({ updateSuccess, eroor: "this user not found" });
    }

    //match the password 
    const passwordCompare = await bcrypt.compare(oldPassword, user.password);

    //if the password not match then we will return 400 status code
    if (!passwordCompare) {
      return res.status(400).json({ updateSuccess, error: "Please enter the correct old password" })
    }

    //generate salt
    const salt = await bcrypt.genSalt(10)

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(newPassword, salt);
    user.password = encryptedPassword;

    //save the updated data 
    let updatedUser = await user.save()
    updateSuccess = true;

    //return res with updated user
    res.json({ updateSuccess, updatedUser });

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ updateSuccess, error: "internal server error-" });
  }

})

//Router 6 : Delete user  using DELETE : api/auth/seller/delete - Login required
router.delete('/delete/:id', fetchUser, async (req, res) => {
  //getting id of the user whose Admin want to delete.
  const deleteUserId = req.params.id;
  try {
    //find user from the database
    let user = await User.findById(deleteUserId);
    if (!user) {
      return res.status(404).send("Not found");
    }

    // getting all the apartment of user 
    const userApartment = await Apartment.find({ seller: deleteUserId })

    //deleting all user's apartment
    for (var i = 0; i < userApartment.length; i++) {
      let deletedApartment = await Apartment.findByIdAndDelete(userApartment[i]._id)
    }

    //deleting the user
    const updatedUser = await User.findByIdAndDelete(deleteUserId)
    res.json({ "message": "User has been successfully deleted" });
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ error: "internal server error-" });
  }

})

module.exports = router;


