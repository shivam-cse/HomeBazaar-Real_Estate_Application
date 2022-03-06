const jwt = require('jsonwebtoken')
const jwt_secret = "shivamsahucse2019iiitg.ac.in.btech";

//middleware to authenticate the user by the jwt token.
const fetchUser = (req, res, next) => {
    //get the token from header body.
    const token = req.header('auth-token');

    //if the token is null then we will return error message with status code 403
    if(!token){ 
        // Access Denied
        res.status(403).send({error:'No token provided!'});
    }

    try {

        // Verification of JWT token
        const data = jwt.verify(token, jwt_secret);
        //put the userData into the req
        req.user = data.user;

        next()
    } catch (error) {
        // Access Denied
        res.status(401).send({error:'Please authenticate with valid token'});
        
    }

}

module.exports = fetchUser