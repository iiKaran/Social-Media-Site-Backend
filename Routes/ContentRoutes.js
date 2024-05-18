const express = require('express');
const {auth} = require("../MiddleWares/auth")
const router = express.Router(); 
const {getAllPosts,createAnPost, deleteAnPost,editAnPost} = require("../Controllers/Post")

router.get("/getAllPosts",auth,getAllPosts);
router.post("/createPost",auth,createAnPost);
router.delete("/removePost", auth ,deleteAnPost);
router.post("/updatePost", auth ,editAnPost);
module.exports = router