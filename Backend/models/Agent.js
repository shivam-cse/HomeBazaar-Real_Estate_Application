const mongoose = require('mongoose');
const { Schema } = require('mongoose');

//Schema for Agent
const AgentSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true,
        unique:true
    },
    contactNumber:{
        type:String,
        required:true,
        unique:true
    },
    workingArea:{
        type:String,
        required:true,
    },
    charges:{
        type:String,
        default:"100"
    },

    password:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model('Agent', AgentSchema);

