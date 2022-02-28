const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ChatSchema = new Schema({
    senderEmail:{
        type:String,
        required:true
    },
    ReceiverEmail:{
        type:String,
        required:true
    },
    message:{  
        type:String,
        required:true
    }

})

module.exports = mongoose.model('Chat', ChatSchema);

