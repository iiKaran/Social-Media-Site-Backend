const cloudinary = require("cloudinary").v2; 

exports.uploadImagetoCloudinary = async (file , foler ,height ,quality)=>{
 
 require("dotenv").config();
 folderof = process.env.CLOUD_FOLDER
 let options = {folderof}
 if(height)
 options.height = height ; 
 if(quality)
 options.quality = quality; 

 options.resourse_type = "auto"; 
 console.log(file.tempFilePath)
 return await cloudinary.uploader.upload(
  file.tempFilePath, options);
}