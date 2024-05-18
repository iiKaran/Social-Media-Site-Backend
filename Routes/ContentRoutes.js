const express = require('express');
const {auth} = require("../MiddleWares/auth")
const router = express.Router(); 
const {getAllPosts,createAnPost, deleteAnPost,editAnPost,fetchAPost,getContentFeed} = require("../Controllers/Post");
const {reactToAPost} = require("../Controllers/like");
const {createComment,editComment,deleteComment, replyToComment,editReply,deleteReply} = require("../Controllers/Comment")

// GET POSTS ALLMYPOSTS SINGLE-POST CONTENT-FEED(post by all users i follow)
router.get("/getAllPostsByMe",auth,getAllPosts);
router.get("/fetchAPost",auth,fetchAPost);
router.get("/getContentFeed",auth,getContentFeed);

// POST - CREATE EDIT DELETE
router.post("/createPost",auth,createAnPost);
router.delete("/removePost", auth ,deleteAnPost);
router.post("/updatePost", auth ,editAnPost);

// LIKE OR UNLIKE
router.post("/reactToAPost", auth ,reactToAPost);

// COMMENT - CREATE EDIT DELETE 
router.post("/comment/createComment",auth,createComment);
router.post("/comment/editComment",auth,editComment);
router.delete("/comment/deleteComment",auth,deleteComment);

// REPLY - CREATE EDIT DELETE
router.post("/reply/createReply",auth,replyToComment);
router.post("/reply/editReply",auth,editReply);
router.delete("/reply/deleteReply",auth,deleteReply);

module.exports = router