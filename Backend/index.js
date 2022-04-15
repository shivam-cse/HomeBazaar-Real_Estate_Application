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
app.listen(PORT, () => {
    console.log(`Server is runing at port ${PORT}`)
})

/* SOCKET.IO CODE ------------------------*/
const io = require('socket.io')(4000, {
    cors: {
        origin: "http://localhost:3000"
    },
})
//store the user id and socket id of current users 
let users = []

//function to add user id and socket id so that we can send message to particular user(receiver)
const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId })
}
//function to remove the user , those are not using chat
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}
//function to get user by taking userId 
const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}
//start the connection 
io.on("connection", (socket) => {
    //add the user when user is joined.
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        //send all users who are currently using chat 
        io.emit("getUsers", users);
    })
    //receive a message from the client (sender). 
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit('getMessage', {
            message
        })
    })

    socket.on("disconnect", () => {
        removeUser(socket.id)
        io.emit("getUsers", users);
    })

})
