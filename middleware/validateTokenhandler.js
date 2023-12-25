const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const validateToken = asyncHandler(async (req, res, next) => {

    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(" ")[1];
        //console.log(authHeader.split(" "))
            jwt.verify(token, 'maddy@2023', (err, decoded) => {
                console.log(err);
                if (err) {
                    res.status(401);
                    throw new Error("User is not authorized");
                }
                console.log('verifyied');
                req.user = decoded.user;
                next();
            });
       if(!token){
            res.status(401);
            throw new Error(" access Token is required for this call");
       }
    };
    if(!authHeader){
        res.status(401);
        throw new Error(" access Token is required for this call");
   }

});

module.exports = validateToken;