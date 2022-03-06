const mongoose = require('mongoose');
const { Schema } = require('mongoose');

//Schema for Seller
const SellerSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model('Seller', SellerSchema);

