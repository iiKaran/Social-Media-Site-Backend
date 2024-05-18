const cloudinary = require("cloudinary"); 
const colors = require("colors/safe");
require("dotenv").config(); 
const clouldinaryConnect  = async () =>{
    
 try{
    await cloudinary.config({
      api_key: process.env.CLOUD_API_KEY, 
      api_secret:process.env.CLOUD_API_SECRET, 
      cloud_name:process.env.CLOUD_NAME
     })
     console.log(colors.green("connected to cloudinary"))
 }
 catch(err)
 {
  console.log("error while connceting to cloudinary",err);
 }
}
module.exports = clouldinaryConnect;