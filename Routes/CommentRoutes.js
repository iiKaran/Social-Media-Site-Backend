const express = require('express');
const {auth} = require('../MiddleWares/auth')
const router = express.Router(); 
const {createAComment}= require("../Controllers/Comment")
router.get("/create",auth,createAComment);
module.exports = router