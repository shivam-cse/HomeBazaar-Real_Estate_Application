var express = require('express')
const connectToMongo = require('./database/db')
var app = express()
const PORT = 5000

connectToMongo();
app.use(express.json());

// app.use('/api/auth', require('./routes/auth'));
app.get('/', (req, res) => {
    res.send("This is homeBazaar real estate office")
})

app.listen(PORT, () =>{
    console.log(`Server is runing at port ${PORT}`)
})
