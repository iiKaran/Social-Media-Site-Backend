const User = require("../models/User");
const Post = require("../models/Post");
exports.reactToAPost =  async(request, response) =>{
    try{
        const {postId} = request.body;
        const user = await User.findById(request.body?.user?.id);
        const post = await Post.findById(postId);
        if(!user){
            return response.status(401).json({
                success: false, 
                message:"You are not authorized"
            })
        }
        if(!post){
            return response.status(404).json({
                success: false, 
                message:"No such post found"
            })
        }
        if(post.likes.includes(user._id)){
            console.log("Already liked");
            post.likes.remove(user._id);
            user.likedPosts.remove(postId);
        await user.save();
            await post.save();
            return response.status(400).json( {
                success: false, 
                message:"unliked successfully "
            })
        }
        post.likes.push(user._id);
        await post.save();
        user.likedPosts.push(postId);
        await user.save();
        return response.status(200).json({
            success: true,
            message:"Liked Successfully",
            post
        })
    }catch(err){
        console.log("Errow reacing to post",err); 
        return response.status(500).json({
            success:false , 
            message:"Something Went wrong"
        })
    }}