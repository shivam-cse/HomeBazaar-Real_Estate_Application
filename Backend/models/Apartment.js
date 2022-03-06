const mongoose = require('mongoose');
const { Schema } = require('mongoose');

//Schema for Apartment
const ApartmentSchema = new Schema({
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'seller' 
    },
    address:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    availability:{
        type:String,
        default:"Available"
    },
    bedrooms:{
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

