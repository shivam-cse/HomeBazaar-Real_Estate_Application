const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

//URL for database connection
const dbURL = process.env.dbURL;

//function to connect database
const connectToMongo = () =>{
    mongoose.connect(dbURL).then(() => {
        console.log("Connected to database")
    }).catch((err) => console.log("No Connection From Database"));
}
module.exports = connectToMongo;
