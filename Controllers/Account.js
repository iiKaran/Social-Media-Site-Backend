const { uploadImagetoCloudinary } = require("../Helpers/ImageUploader");
const User = require("../models/User");
const colors = require("colors/safe");
exports.followAnUser =  async(request, response) =>{
    try{
        const {idtoFollow} = request.body;
        // console.log("id to follow is ", idtoFollow);
        const user = await User.findById(idtoFollow);
        const mineId =  request.body?.user?.id ;
        const me = await User.findById(mineId);

        if(!mineId){
            return response.status(401).json({
                success: false, 
                message:"You are not authorized"
            })
        }
        if(!user){
            return response.status(404).json({
                success: false, 
                message:"No such user not found"
            })
        }
        if (user._id == mineId){
            return response.status(401).json({
                success: false, 
                message:"You are not authorized to follow yourself"
            })
        }
        if(me.following.includes(user._id)){
            console.log("Already following");
            return response.status(400).json( {
                success: false, 
                message:"Already following"
            })
        }
        me.following.push(user._id);
        user.followers.push(mineId);
        await me.save();
        await user.save();
        return response.status(200).json({
            success: true,
            me
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
exports.unfollowAnUser =  async(request, response) =>{
    try{
        const {idtoUnfollow} = request.body;
        // console.log("id to follow is ", idtoUnfollow);
        const user = await User.findById(idtoUnfollow);
        const mineId =  request.body?.user?.id ;
        if(!mineId){
            return response.status(401).json({
                success: false, 
                message:"You are not authorized"
            })
        }
        if(!user){
            return response.status(404).json({
                success: false, 
                message:"No such user not found"
            })
        }
        const me = await User.findById(mineId);
        if (user._id == mineId){
            return response.status(401).json({
                success: false, 
                message:"You are not authorized to Unfollow yourself"
            })
        }
        if(!me.following.includes(user._id)){
            console.log("Not Already following");
            return response.status(400).json( {
                success: false, 
                message:"Both users are not connected"
            })
        }
        me.following.remove(user._id);
        user.followers.remove(mineId);
        await me.save();
        await user.save();
        return response.status(200).json({
            success: true,
            me
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

exports.searchUsersByUsername = async (request, response) => {
    try {
        const { searchTerm } = request.body;
        if (!searchTerm) {
            return response.status(400).json({
                success: false,
                message: "Search term is required"
            });
        }

        const users = await User.find({ 
            $text: { $search: searchTerm }
        });
        const currentUser = await User.findById(request.body?.user?.id);
        if(!currentUser){
            return response.status(401).json({
                success: false, 
                message:"You are not authorized"
            })
        }
        const usersWithStatus = users
        .filter(user => !user._id.equals(currentUser._id)) // Remove current user from the list
        .map(user => {
            return {
                ...user.toObject(),
                isFollowedByMe: currentUser.following.includes(user._id)
            };
        });
        return response.status(200).json({
            success: true,
            users: usersWithStatus
        });
    } catch (err) {
        console.error("Error:", err);
        return response.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

exports.searchUniquelyWihMail = async (request, response) => {  
    try {
        const { email } = request.body;
        if (!email) {
            return response.status(400).json({
                success: false,
                message: "Search Email is required"
            });
        }
         let user = await User.findOne({ email });
        if (!user) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        let newUpdatedUser = user.toObject(); 
        newUpdatedUser.isFollowedByMe = user.followers.includes(request.body?.user?.id)?true:false;
        if(newUpdatedUser.email == request.body?.user?.email){
            newUpdatedUser= null;
            return response.status(400).json({
                success:"false",
                message:"You are not authorized to search yourself Please directly visit to profile page"
            
            }) 
        } 
         return response.status(200).json({
            success: true,
            user:newUpdatedUser
        });
    } catch (err) {
        console.error("Error:", err);
        return response.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

exports.updateProfile = async(request, response) =>{
    try{
        const {bio, gender,age} = request.body;
        const media= request?.files?.media; 
        const user = await User.findById(request.body?.user?.id);
        // console.log(media)ß
        if(!user){
            return response.status(404).json({
                success: false, 
                message:"User not found"
            })
        }
        let userImage = null ;
        if(media != undefined){
            userImage = await uploadImagetoCloudinary(media ,"StudyNotion");
        }
        user.bio = bio;
        user.gender = gender;
        user.age = age ; 
        user.image = userImage?.secure_url;
        await user.save();
        return response.status(200).json({
            success: true,
            user
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

exports.getallFollowes = async(request , response)=>{
    try{
        const id = request.body?.user?.id;
        const user = await User.findById(id).populate("followers");
        if(!user){
            return response.status(404).json({
                success: false, 
                message:"User not found"
            })
        }
        return response.status(200).json({
            success: true,
            followers:user.followers
        })
    }
    catch(err){
        console.log("Error in fetching followers",err); 
        return response.status(500).json({
            success: false, 
            message:"Something Went wrong"
        })
    }
}

exports.getallFollowing = async(request , response)=>{
    try{
        const id = request.body?.user?.id;
        const user = await User.findById(id).populate("following");
        if(!user){
            return response.status(404).json({
                success: false, 
                message:"User not found"
            })
        }
        return response.status(200).json({
            success: true,
            following:user.following
        })
    }
    catch(err){
        console.log("Error in fetching followers",err); 
        return response.status(500).json({
            success: false, 
            message:"Something Went wrong"
        })
    }
}

exports.deleteAccountRequest = async(request , response)=>{
    try{
        const id = request.body?.user?.id ;
        const user = await User.findById(id);
        if(!user){
            return response.status(404).json({
                success: false, 
                message:"User not found"
            })
        }
        user. deletionRequest = Date.now();
        await user.save();

        return response.status(200).json({
            success: true,
            message: "Account deletion requested. Your account will be deleted after 30 days of inactivity."
        });
    }
    catch(err){
        console.log("Error in fetching followers",err); 
        return response.status(500).json({
            success: false, 
            message:"Something Went wrong"})
}}