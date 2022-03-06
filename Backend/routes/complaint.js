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
        body("email", "Enter  a valid email").isEmail(),
        body("title", "Enter  a valid  title").isLength({ min: 5 }),              // title must be at least 5 chars long
        body("description", "Enter  a valid description").isLength({ min: 10 })  // description must be at least 5 chars long

    ],
    async (req, res) => {
        //If there are error, return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        try {

            //creating compalint and save
            let complaint = await Complaint.create({
                UserEmail: req.body.email,
                title: req.body.title,
                description: req.body.description
            });

            res.send("Successfully registered your complaint !");
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some ERROR occured");
        }
    }
);

// ROUTE 2 : Fetch all complaints using GET "/api/complaints/fetchAll" - Login required
router.get("/fetchAll", fetchuser, async (req, res) => {
    try {
        
      // now verifying whether the token passed is of any admin or of some other illegal person
      const admin = await Admin.findById(req.user.id);
      if (!admin)
        return res.status(404).send("Operation not allowed !!!");
         
        const complaints = await Complaint.find(); // finding all complaints stored in Complaints table
        res.json(complaints);
    }
  
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  

module.exports = router;