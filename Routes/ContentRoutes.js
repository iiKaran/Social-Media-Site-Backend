const express = require('express');
const {auth} = require("../MiddleWares/auth")
const router = express.Router(); 
const {getAllPosts,createAnPost, deleteAnPost,editAnPost,fetchAPost} = require("../Controllers/Post")
const {reactToAPost} = require("../Controllers/like")

router.get("/getAllPostsByMe",auth,getAllPosts);
router.get("/fetchAPost",auth,fetchAPost);
router.post("/createPost",auth,createAnPost);
router.delete("/removePost", auth ,deleteAnPost);
router.post("/updatePost", auth ,editAnPost);
router.post("/reactToAPost", auth ,reactToAPost);
module.exports = router