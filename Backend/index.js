var express = require('express')  //Allows you to define routes of your application based on HTTP methods and URLs.
const connectToMongo = require('./database/db')
const dotenv = require('dotenv').config()
var cors = require('cors')
var app = express()
const PORT = process.env.PORT

//connection from the database
connectToMongo();

app.use(cors())
//parse requests of content-type - application/json
app.use(express.json());

//Routes for all api
app.use('/api/auth/seller', require('./routes/authentication/seller'));
app.use('/api/auth/admin', require('./routes/authentication/admin'));
app.use('/api/auth/buyer', require('./routes/authentication/buyer'));
app.use('/api/auth/agent', require('./routes/authentication/agent'));
app.use('/api/apartment/', require('./routes/apartment'));
app.use('/api/complaint/', require('./routes/complaint'));
app.use("/api/messages", require('./routes/message'));
//our server listing at port number 5000
app.listen(PORT, () =>{
    console.log(`Server is runing at port ${PORT}`)
})
