const express = require('express')
const router = express.Router();
const Messages = require("../models/Message");
const UserContacted = require("../models/UserContacted");

// ROUTE 1: Adding new message using POST "/api/messages/add" 
router.post('/add', async (req, res) => {
  let success = false;
  try {
    const { from, to, message } = req.body;   // getting sender-id (from) and recevier-id (to) from body
    // storing message in db
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      success = true;
      return res.json({ success, msg: "Message added successfully." });    // succesfully added message in db
    }
    else return res.json({ success, error: "Failed to add message to the database" });   // error in adding  message in db

  }
  // handling errors
  catch (error) {
    console.log(error)
    return res.json({ success, error: "Internal server error" });
  }
})

// ROUTE 2: Getting particular sender and receiver messages using POST "/api/messages/get" 

router.post("/get", async (req, res) => {
  let success = false;
  try {
    const { from, to } = req.body;         // getting sender-id (from) and recevier-id (to) from body

    // finding all messages from db
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    // returning final chat messages between given sender and receiver
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    success = true;
    res.json({ success, projectedMessages });
  }
  // Error Handling
  catch (error) {
    console.log(error)
    return res.json({ success, error: "Internal server error" });
  }
})

// ROUTE 3: Connecting sender to receiver  using POST "/api/messages/addReceiver" 

router.post('/addReceiver', async (req, res) => {

  let success = false;
  try {
    const { from, to, receiverName, receiverType, senderName, senderType } = req.body;  // getting sender and recevier details

    // Creating first connection between sender and receiver
    const data = await UserContacted.create({
      receiver: to,
      receiverName: receiverName,
      senderName: senderName,
      senderType: senderType,
      receiverType: receiverType,
      users: [from, to],
      sender: from,
    });

    if (data) {
      success = true;
      return res.json({ success, msg: "Receiver added successfully." });  // Success in connecting sender and receiver
    }
    else return res.json({ success, error: "Failed to add message to the database" });  // Error in connecting sender and receiver
  }
  // Handling Errors
  catch (error) {
    console.log(error)
    return res.json({ success, error: "Internal server error" });
  }
})

// ROUTE 4: getting chat history of senders using POST "/api/messages/getReceiver" 

router.post("/getReceiver", async (req, res) => {
  let success = false;
  try {
    const { from } = req.body;   // getting sender id from body

    // finding all receivers contacted by sender
    const receivers = await UserContacted.find({
      users: {
        $in: [from],
      },
    }).sort({ updatedAt: 1 });

    success = true;
    res.json({ success, receivers });   // sending response 
  }
  // Error Handling
  catch (error) {
    console.log(error)
    return res.json({ success, error: "Internal server error" });
  }
})



module.exports = router;