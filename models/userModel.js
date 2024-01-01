var mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the User Name"],
    },
    email: {
        type: String,
        required: [true, "Please add the User Email"],
    },
    password: {
        type: String,
        required: [true, "Please add the User Password"],
    },
    role: {
        type: String,
        required: [true, "Please add the User Role"],
    },
    mobile:{
        type: String,
        required: [true, "Please add the Mobile"],
    }
})

module.exports = mongoose.model("User",userSchema)