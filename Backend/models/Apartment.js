const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ApartmentSchema = new Schema({
    Seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Seller' 
    },
    Address:{
        type:String,
        required:true
    },
    Area:{
        type:String,
        required:true
    },
    type:{
        type:String
    },
    Availability:{
        type:String,
        default:"Available"
    },
    Bedrooms:{
        type:Number,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Apartment', ApartmentSchema);

