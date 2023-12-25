const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { BulkCountryUpdateInstance } = require("twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate");

const CreatUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(404).json({ message: "fields" });
    }
    const userAvailable = await User.findOne({email});
    if (userAvailable) {
        res.status(404).json({ message: "User already exist" });
    }
    else {
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username, email, password: hashpassword,
        });
        res.status(200).json({message:"User created Successfully",Date:user});
    }
    
})
const LoginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    if ( !email || !password) {
        res.status(404).json({ message: "Please fill all mandatory fields" });

    }
    const user = await User.findOne({email});
    if (user && (await bcrypt.compare(password,user.password))) {
        const acesstoken = jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },
        'maddy@2023',
        {expiresIn:"10m"}
        );
        res.status(200).json({accessToken:acesstoken});
    }
    else
    {
        res.status(401).json({message:"email and password doesn't match"});
    }
    
})
const CurrentUser = asyncHandler(async (req, res) => {
    console.log(req.user)
    res.status(200).json({message:req.user.username});
})





module.exports = { CreatUser, LoginUser, CurrentUser };