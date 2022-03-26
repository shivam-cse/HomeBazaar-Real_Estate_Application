const express = require('express')
const router = express.Router();
const Messages = require("../models/Message");
const UserContacted = require("../models/UserContacted");


router.post('/add', async (req, res) => {

  let success = false;
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      success = true;
      return res.json({ success, msg: "Message added successfully." });
    }
    else return res.json({ success, error: "Failed to add message to the database" });
  } catch (error) {
    console.log(error)
    return res.json({ success, error: "Internal server error" });
  }
})

router.post("/get", async (req, res) => {
  let success = false;
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    success = true;
    res.json({ success, projectedMessages });
  } catch (error) {
    console.log(error)
    return res.json({ success, error: "Internal server error" });
  }
})


router.post('/addReceiver', async (req, res) => {

  let success = false;
  try {
    const { from, to, receiverName, receiverType, senderName, senderType } = req.body;
    const data = await UserContacted.create({
      receiver: to,
      receiverName: receiverName,
      senderName: senderName,
      senderType: senderType,
      receiverType:receiverType,
      users: [from, to],
      sender: from,
    });

    if (data) {
      success = true;
      return res.json({ success, msg: "Receiver added successfully." });
    }
    else return res.json({ success, error: "Failed to add message to the database" });
  } catch (error) {
    console.log(error)
    return res.json({ success, error: "Internal server error" });
  }
})

router.post("/getReceiver", async (req, res) => {
  let success = false;
  try {
    const {from} = req.body;

    const receivers = await UserContacted.find({
      users: {
        $in: [from],
      },
    }).sort({ updatedAt: 1 });

    success = true;
    res.json({ success, receivers });
  } catch (error) {
    console.log(error)
    return res.json({ success, error: "Internal server error" });
  }
})



module.exports = router;