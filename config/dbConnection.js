const mongoose = require("mongoose")


const connectDb = async()=>{
    try{
       
        const connect = await mongoose.connect('mongodb+srv://madhavreddy939:Marvel%402023@maddycluster.mvavmy1.mongodb.net/mycontacts-backend');
        console.log("connection host",connect.connection.host,connect.connection.name);
    }catch(err){
        console.log(err);
    }
}
 module.exports = connectDb;