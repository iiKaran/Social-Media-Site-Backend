const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    media:{
        type:String , 
        trim:true ,
        default:null , 
    }, 
    caption:{
        type:String , 
        trim:true ,
        default:null , 
    }, 
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }], 
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
module.exports = mongoose.model("Post", postSchema);
