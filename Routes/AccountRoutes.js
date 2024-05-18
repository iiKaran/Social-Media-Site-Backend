const express = require('express');
const {auth} = require("../MiddleWares/auth")
const router = express.Router(); 
const {followAnUser,unfollowAnUser,searchUsersByUsername,searchUniquelyWihMail,updateProfile,getallFollowes,getallFollowing} = require("../Controllers/Account")
const {createAComment}= require("../Controllers/Comment")
router.post("/followAnUser",auth,followAnUser);
router.post("/unfollowAnUser",auth,unfollowAnUser);
router.post("/updateProfile",auth,updateProfile);
router.get("/searchByName",auth,searchUsersByUsername);
router.get("/searchByMail",auth,searchUniquelyWihMail);
router.get("/getallFollowers",auth,getallFollowes);
router.get("/getAllFollowing",auth,getallFollowing);
router.get("/create",auth,createAComment)

module.exports = router