var express = require('express');
const { body, validationResult } = require('express-validator');
const Agent = require('../../models/Agent');
var bcrypt = require('bcrypt');
var router = express.Router();
const jwt = require("jsonwebtoken");
const fetchUser = require('../../middleware/fetchUser');
const dotenv = require('dotenv').config()
const jwt_secret = process.env.jwt_secret;

//Route-1 Create a Agent using : POST "/api/auth/agent/signup" , No login required  
router.post("/signup", [

    // validating Input
    body('name', "Please enter valid name of atleast length of 2").isLength({ min: 2 }),
    body('email', "please enter a valid email").isEmail(),
    body('contactNumber', "Please enter valid Phone number").isLength({ min: 10, max: 10 }),
    body('workingArea', "Please enter valid area of atleast length of 2").isLength({ min: 2 }),
    body('password', "Please enter valid area of atleast length of 5").isLength({ min: 5 }),
], async (req, res) => {

    let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    let errors = validationResult(req)

    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))
    console.log(extractedErrors)
    // if any  Validation error
    if (!errors.isEmpty()) {

        // console.log(errors.error[0].msg + "err2");
        return res.status(400).json({ success, error: extractedErrors[0] });
    }

    try {
        const { name, email, contactNumber, workingArea, password, charges } = req.body;

        // check if contact number only contain digit
        let isnum = /^\d+$/.test(contactNumber);
        if (isnum == false) {
            return res.status(400).json({ success, error: "Please enter valid Phone number" });
        }

        // finding agent with this email
        let agent = await Agent.findOne({ email: email });

        // if any agent is found with this email
        if (agent) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exist" });
        }

        // finding agent with this contact Number
        agent = await Agent.findOne({ contactNumber: contactNumber });
        // if any agent is found
        if (agent) {
            return res.status(400).json({ success, error: "Sorry a user with this contact Number already exist" });
        }

        // genrating salt of lenght 10 for password 
        var salt = bcrypt.genSaltSync(10);

        // Hashing(encrypting) a password 
        var Password = bcrypt.hashSync(password, salt);

        // creating agent object
        agent = await Agent.create({
            name: name,
            email: email,
            contactNumber: contactNumber,
            workingArea: workingArea,
            password: Password,
            charges: charges
        })

        // creating data for authtoken
        const data = {
            user: {
                id: agent.id,
            },
        };

        // creating auth token ans sending as responce
        const authtoken = jwt.sign(data, jwt_secret);
        success = true
        res.json({ success, authtoken: authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Serveral error" });
    }

})

//Route-2 Login a Agent using : POST "/api/auth/agent/login" , No login required  
router.post("/login", [

    // validating Input
    body('email', "please enter a valid email").isEmail(),
    body('password', "Please enter valid area of atleast length of 5").isLength({ min: 5 }),
], async (req, res) => {
    let success = false
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    // if any  Validation error
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
    }

    try {
        const { email, password } = req.body;
        // / finding agent with this email
        let agent = await Agent.findOne({ email: email });

        // if any agent is not  found with this email
        if (!agent) {
            return res.status(400).json({ success, error: "PLease try to login with correct credential" });
        }

        // if password is not match with user
        if (bcrypt.compareSync(password, agent.password) == false) {
            return res.status(400).json({ success, error: "PLease try to login with correct credential" });
        }

        // creating data for authtoken
        const data = {
            user: {
                id: agent.id,
            },
        };

        // generting authtoekn and sending
        const authtoken = jwt.sign(data, jwt_secret);
        success = true
        res.json({ success, authtoken: authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Serveral error" });
    }

})

// Route - 3 fetching a Agent detail using : POST "/api/auth/agent/getUser" , login required 
router.get("/getUser", fetchUser, async (req, res) => {
    let success = false;
    try {
        // getting user id from token(using fetchUser middleware)
        const userid = req.user.id;
        //finding user with auth token (user id)
        const temp = await Agent.findById(userid)
        if (temp == null) {
            return res.status(404).json({ success, error: "wrong credentials" });
        }
        // finding agent with id
        const agent = await Agent.findById(userid).select("-password");
        success = true;
        res.json({ success, agent });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Serveral error" });
    }
})

// Route - 4 update a Agent detail using : POST "/api/auth/agent/update" , login required  
router.put("/update", fetchUser, async (req, res) => {
    let success = false
    try {
        const { name, workingArea, contactNumber, charges } = req.body;

        // creating object newAgentDetail
        const newAgentDetail = {};

        // getting user id from token(using fetchUser middleware)
        const userid = req.user.id;

        //  if name is passed and to update
        if (name) {
            if (name.length < 2)
                return res.status(400).json({ success, error: "please enter valid name" });

            newAgentDetail.name = name;
        }

        //  if workingArea is passed and to update
        if (workingArea) {
            if (workingArea.length < 2)
                return res.status(400).json({ success, error: "please enter valid workingArea" });

            newAgentDetail.workingArea = workingArea;
        }

        //  if charge is passed and to update
        if (charges) {
            newAgentDetail.charges = charges;
        }

        //  if contactNumber is passed and to update
        if (contactNumber) {
            // check if contact number only contain digit and length of 10
            let isnum = /^\d+$/.test(contactNumber);
            if ((contactNumber).length != 10 || isnum == false) {
                return res.status(400).json({ success, error: "Please enter valid Phone number" });
            }

            // finding agent with this contact Number
            let agent = await Agent.findOne({ contactNumber: contactNumber });
            // if any agent is found
            if (agent) {
                return res.status(400).json({ success, error: "Sorry a user with this contact Number already exist" });
            }

            newAgentDetail.contactNumber = contactNumber;
        }

        agent = await Agent.findByIdAndUpdate(userid, { $set: newAgentDetail }, { new: true }).select("-password");
        success = true;
        res.json({ success, agent });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Serveral error" });
    }
})


// Route - 5 update a Agent Password using : POST "/api/auth/agent/updatePassword" , login required  
router.put("/updatePassword", fetchUser, async (req, res) => {
    let success = false;
    try {

        const { oldPassword, newPassword } = req.body;

        // creating object newAgentDetail
        const newAgentDetail = {};

        // getting user id from token(using fetchUser middleware)
        const userid = req.user.id;

        // finding agent with  ID(userID)
        let agent = await Agent.findById(userid);

        // if any agent is not  found with ID
        if (!agent) {
            return res.status(400).json({ success, error: "PLease try to login with correct credential" });
        }

        //  if password is passed and to update
        if ((newPassword).length >= 5) {
            // if password is not match with user
            if (bcrypt.compareSync(oldPassword, agent.password) == false) {
                return res.status(400).json({ success, error: "PLease enter correct Old password" });
            }

            // genrating salt of lenght 10 for password 
            var salt = bcrypt.genSaltSync(10);

            // Hashing(encrypting) a password 
            var password = bcrypt.hashSync(newPassword, salt);

            newAgentDetail.password = password;
        }
        else {
            return res.status(400).json({ success, error: "Please enter valid  Password" });
        }

        agent = await Agent.findByIdAndUpdate(userid, { $set: newAgentDetail }, { new: true }).select("-password");
        success = true;
        res.json({ success, message: "Your password is succesfully updated" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Serveral error" });
    }
})



// Route - 6 delete a Agent detail using : POST "/api/auth/agent/delete:id" , login required(as Admin)
router.delete("/delete/:id", fetchUser, async (req, res) => {
    let success = false;
    try {

        // id of agent which is deleted
        const id = req.params.id;

        // find the agent to be deleted
        let agent = await Agent.findById(id);

        if (!agent) {
            return res.status(400).json({ success, error: "Not found" });
        }

        agent = await Agent.findByIdAndDelete(id);
        success = true
        res.json({ success, error: "Agent has been deleted" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Serveral error" });
    }
})

//Route 7 :This api to get all user  GET : api/agent/alluser - login required
router.get('/alluser', async (req, res) => {

    try {
        // find the all apartment of particular seller from database
        const users = await Agent.find();
        //sent the response to client
        res.json(users)

    } catch (error) {
        //handle the error
        res.status(500).json({ error: "internal server error" });
    }
})


module.exports = router;