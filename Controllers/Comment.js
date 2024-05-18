const Comment = require("../models/Comment");


exports.createAComment = async(request, response) =>{
    try{
        const {text} = request.body;
        const comment = await Comment.create({
            text
        })
        return response.status(200).json({
            success: true,
            comment
        })
    }
    catch(err){
        console.log(colors.red("err",err)); 
        return response.status(500).json({
            success: false, 
            message:"Something Went wrong"
        })
    }
}