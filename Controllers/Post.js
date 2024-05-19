const { responseponse } = require("express");
const { uploadImagetoCloudinary } = require("../Helpers/ImageUploader");
const Post = require("../models/Post"); 
const User = require("../models/User");
const colors = require("colors/safe");
const schedule = require('node-schedule');
// uploadImagetoCloudinary
exports.getAllPosts = async(request, responseponse) =>{
    
    try{
        // console.log("the request is ", request.body?.user)
        const posts = await Post.find({author:request.body?.user?.id});
        return responseponse.status(200).json({
            success: true,
            posts
        })
    }
    catch(err){
        console.log(colors.red("err",err)); 
        return responseponse.status(500).json({
            success: false, 
            message:"Something Went wrong"
        })
    }
}
exports.createAnPost  = async(request, responseponse) =>{
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
        return responseponse.status(200).json({
            success: true,
            post
        })
    }
    catch(err){
        console.log(colors.red("err",err)); 
        return responseponse.status(500).json({
            success: false, 
            message:"Something Went wrong"
        })
    }
}
exports.deleteAnPost = async(request, responseponse) =>{
    try{
        const {postId} = request.body;
        const post = await Post.findById(postId);
        if(!post){
            return responseponse.status(404).json({
                success: false, 
                message:"Post not found"
            })
        }
        if (post.author != request.body?.user?.id){
            return responseponse.status(401).json({
                success: false, 
                message:"You are not authorized to delete this post"
            })
        }
        await Post.findByIdAndDelete(postId);
        return responseponse.status(200).json({
            success: true,
            post
        })
    }
    catch(err){
        console.log(colors.red("err",err)); 
        return responseponse.status(500).json({
            success: false, 
            message:"Something Went wrong"
        })
    }
}
exports.editAnPost = async(request , responseponse)=>{
    try{
        const {postId,  caption}=  request.body; 
        const media = request.files.media ; 
        const post = await Post.findById(postId);
        if(!post){
            return responseponse.status(404).json({
                success: false, 
                message:"Post not found"
            })
        }
        if (post.author != request.body?.user?.id){
            return responseponse.status(401).json({
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
        return responseponse.status(200).json({
            success: true,
            post
        })
    }
    catch(err)
    {
        console.log(colors.red("Errors Occured while editing post",err));
        return responseponse.status(500).json({
             success:false, 
             message:"Some thing went wrong"
        })
    }
}

exports.fetchAPost = async(request , responseponse)=>{
    try{
        const {postId}= request.body;
        const post = await Post.findById(postId).populate("likes").populate("author").populate("comments");
        if(!post){
            return responseponse.status(404).json({
                success: false, 
                message:"Post not found"
            })
        }
        return responseponse.status(200).json({
            success: true,
            post
        })
    }catch(err){
        console.log("Error in fetching a post",err); 
        return responseponse.status(500).json({
            success:false , 
            message:"something went wrong"
        })
    }
}
exports.getContentFeed = async (request, responseponse) => {
    try {
        const currentUserId = request.body?.user?.id;

        if (!currentUserId) {
            return responseponse.status(401).json({
                success: false,
                message: "You are not authorized"
            });
        }

        // Fetch the current user to get their followers
        const currentUser = await User.findById(currentUserId).populate('following');

        if (!currentUser) {
            return responseponse.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get the list of follower IDs
        const followers = currentUser.following.map(follower => follower._id);
        
        // Add the current user's ID to the list
        followers.push(currentUserId);

        // Fetch posts created by the current user and their followers
        const posts = await Post.find({
            author: { $in: followers }
        }).populate('author');

        return responseponse.status(200).json({
            success: true,
            posts
        });
    } catch (err) {
        console.log(err);
        return responseponse.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};
function timeToMilliseconds(timeString) {
    const timeRegex = /(\d+)d(\d+)h(\d+)m/;
    const match = timeString.match(timeRegex);
    if (!match) {
        throw new Error('Invalid time format');
    }

    const days = parseInt(match[1]);
    const hours = parseInt(match[2]);
    const minutes = parseInt(match[3]);

    const daysInMilliseconds = days * 24 * 60 * 60 * 1000;
    const hoursInMilliseconds = hours * 60 * 60 * 1000;
    const minutesInMilliseconds = minutes * 60 * 1000;

    return daysInMilliseconds + hoursInMilliseconds + minutesInMilliseconds;
}
exports.schedulePost = async (request, response) => {
    const { media, caption, postTime } = request.body;
    // if (!media || !caption || !postTime) {
    //     return response.status(400).json({ error: 'Missing post data' });
    // }
    const millisec = timeToMilliseconds(postTime); 
    console.log(millisec);

    // Schedule a job to create the post at the specified time
    schedule.scheduleJob(Date.now() + millisec, async () => {
        try {
            // Create the post
            console.log("Trying");
            const { caption } = request.body;
            const media = request?.files?.media; 
            console.log("media is ", colors.magenta(media));
            let postImage = null; 
            if (media != undefined) {
                postImage = await uploadImagetoCloudinary(media, "StudyNotion");
            }
            const id = request.body?.user?.id;
            if (!id) {
                console.log(colors.red("No user found"));
            }
            const post = await Post.create({
                media: postImage?.secure_url,
                caption, 
                author: id,
            });
            console.log('Post created successfully');
        } catch (err) {
            console.error('Error creating post:', err);
        }
    });

    return response.status(200).json({ message: 'Post scheduled successfully' });
};
