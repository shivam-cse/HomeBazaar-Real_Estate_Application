const mongoose = require("mongoose");

const UserConactedSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    users: Array,
    receiverName:{
        type: String,
        required: true 
    },
    receiverType:{
        type: String,
        required: true 
    },
    senderName:{
        type: String,
        required: true 
    },
    senderType:{
        type: String,
        required: true 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserConacted", UserConactedSchema);
