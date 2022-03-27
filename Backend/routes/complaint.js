const express = require("express");
const Complaint = require("../models/Complaint");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Admin = require("../models/Admin")
var fetchuser = require("../middleware/fetchUser");
const dotenv = require('dotenv').config()
const jwt_secret = process.env.jwt_secret;

// ROUTE 1: create a complaint using POST "/api/complaint/create" 
router.post("/create",
    [ 
        body("email", "Enter  a valid email").isEmail(),                         // email format valid
        body("title", "Enter  a valid  title").isLength({ min: 5 }),              // title must be at least 5 chars long
        body("description", "Enter  a valid description").isLength({ min: 10 })  // description must be at least 5 chars long

    ],
    async (req, res) => {
        let success = false
        //If there are error, return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success,  error: errors.array()});
        }
        try {

            //creating compalaint and save
            let complaint = await Complaint.create({
                UserEmail: req.body.email,
                title: req.body.title,
                description: req.body.description
            });
            success = true
            // sending response 
            res.json({success, message:"Successfully registered your complaint !"});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({success, error:"Some ERROR occured"});
        }
    }
);

// ROUTE 2 : Fetch all complaints using GET "/api/complaints/fetchAll" - Login required
router.get("/fetchAll", fetchuser, async (req, res) => {
    try {
        let success = false
      // now verifying whether the token passed is of any admin or of some other illegal person
      const admin = await Admin.findById(req.user.id);
      if (!admin)
        return res.status(404).json({success, errro:"Operation not allowed !!!"});
         
        const complaints = await Complaint.find(); // finding all complaints stored in Complaints table
        success = true
        res.json({success, complaints});
    }
  // error handling
    catch (error) {
      console.error(error.message);
      res.status(500).json({success, error:"Internal Server Error"});
    }
  });
  

module.exports = router;