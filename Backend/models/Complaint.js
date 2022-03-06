const mongoose = require('mongoose');
const { Schema } = require('mongoose');

//Schema for Complaint
const ComplaintSchema = new Schema({
    UserEmail:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('Complaint', ComplaintSchema);

