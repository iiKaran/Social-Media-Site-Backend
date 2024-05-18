const { response } = require("express");
const { uploadImagetoCloudinary } = require("../Helpers/ImageUploader");
const Post = require("../models/Post"); 
const colors = require("colors/safe");
uploadImagetoCloudinary
exports.getAllPosts = async(request, response) =>{
    
    try{
        // console.log("the req is ", request.body?.user)
        const posts = await Post.find({author:request.body?.user?.id});
        return response.status(200).json({
            success: true,
            posts
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
exports.createAnPost  = async(request, response) =>{
    try{
        const {caption} = request.body;
        const media= request?.files?.media; 
        console.log("media is ",colors.magenta(media));
        let postImage = null ; 
        if(media != undefined){
         postImage = await uploadImagetoCloudinary(
			media,
			"StudyNotion"
		);
    }
        const id = request.body?.user?.id ;
        if(!id)
            {
                console.log(colors.red("No user found"))
            }
            // console.log(postImage)
        const post = await Post.create({
            media : postImage?.secure_url,
            caption, 
            author:id,
        })
        return response.status(200).json({
            success: true,
            post
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
exports.deleteAnPost = async(request, response) =>{
    try{
        const {postId} = request.body;
        const post = await Post.findById(postId);
        if(!post){
            return response.status(404).json({
                success: false, 
                message:"Post not found"
            })
        }
        if (post.author != request.body?.user?.id){
            return response.status(401).json({
                success: false, 
                message:"You are not authorized to delete this post"
            })
        }
        await Post.findByIdAndDelete(postId);
        return response.status(200).json({
            success: true,
            post
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
exports.editAnPost = async(request , response)=>{
    try{
        const {postId,  caption}=  request.body; 
        const media = request.files.media ; 
        const post = await Post.findById(postId);
        if(!post){
            return response.status(404).json({
                success: false, 
                message:"Post not found"
            })
        }
        if (post.author != request.body?.user?.id){
            return response.status(401).json({
                success: false, 
                message:"You are not authorized to edit this post"
            })
        }
        let postImage = null ; 
        if(media != undefined){
         postImage = await uploadImagetoCloudinary(
			media,
			"StudyNotion"
		);
    }
        post.media = postImage?.secure_url,
        post.caption = caption;
        await post.save();
        return response.status(200).json({
            success: true,
            post
        })
    }
    catch(err)
    {
        console.log(colors.red("Errors Occured while editing post",err));
        return response.status(500).json({
             success:false, 
             message:"Some thing went wrong"
        })
    }
}

exports.fetchAPost = async(request , response)=>{
    try{
        const {postId}= request.body;
        const post = await Post.findById(postId).populate("likes").populate("author").populate("comments");
        if(!post){
            return response.status(404).json({
                success: false, 
                message:"Post not found"
            })
        }
        return response.status(200).json({
            success: true,
            post
        })
    }catch(err){
        console.log("Error in fetching a post",err); 
        return response.status(500).json({
            success:false , 
            message:"something went wrong"
        })
    }
}












