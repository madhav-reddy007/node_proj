const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { MongoClient } = require('mongodb');
const { setkeys, getkeys } = require("../config/mongo");
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns')
const { BulkCountryUpdateInstance } = require("twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate");

const CreatUser = asyncHandler(async (req, res) => {

    const { username, email, password, role, mobile } = req.body;
    if (!username || !email || !password) {
        res.status(404).json({ message: "fields" });
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(404).json({ message: "User already exist" });
    }
    else {
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username, email, password: hashpassword, role, mobile
        });
        res.status(200).json({ message: "User created Successfully", Date: user });
    }

})
const LoginUser = asyncHandler(async (req, res) => {

    const { mobile, otp } = req.body;
    if (!otp) {
        const user = await User.findOne({ mobile });
        if (user) {
            let otp = Math.random().toString().substring(2, 6);
            const resp = await sendsms(mobile, otp);
            if (resp.MessageId) {
                setkeys(mobile, otp);
                res.status(200).json({ resp });
            }
        }
    }
    else {
        getkeys();
    }
    res.status(200).json({ accessToken: "successs" });
    // const { email, password } = req.body;
    // if (!email || !password) {
    //     res.status(404).json({ message: "Please fill all mandatory fields" });
    // }
    // const user = await User.findOne({ email });
    // if (user && (await bcrypt.compare(password, user.password))) {
    //     const acesstoken = jwt.sign({
    //         user: {
    //             username: user.username,
    //             email: user.email,
    //             id: user.id,
    //         },
    //     },
    //         'maddy@2023',
    //         { expiresIn: "10m" }
    //     );
    //     res.status(200).json({ accessToken: acesstoken });
    // }
    // else {
    //     res.status(401).json({ message: "email and password doesn't match" });
    // }

})
const CurrentUser = asyncHandler(async (req, res) => {
    console.log(req.user)
    res.status(200).json({ message: req.user.username });
})

const sendsms = async (mobile, otp) => {
    const param = {
        Message: `Your Login Verification OTP: ${otp}`,
        PhoneNumber: mobile,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': 'String'
            }
        }
    }
    console.log(param);
    const sns = new SNSClient({
        region: `${process.env.REGION}`,
        credentials: {
            accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
            secretAccessKey: `${process.env.AWS_SECRET_KEY}`
        }
    })
    console.log(process.env.AWS_ACCESS_KEY);
    console.log(process.env.AWS_SECRET_KEY);
    const command = new PublishCommand(param);
    const message = await sns.send(command);
    console.log(message)
    return message;
}


module.exports = { CreatUser, LoginUser, CurrentUser };