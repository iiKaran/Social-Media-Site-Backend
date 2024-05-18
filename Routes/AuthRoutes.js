const express = require('express');
const router = express.Router();
const {sendOtp, signUp,logIn} = require("../Controllers/Auth");
const { sign } = require('jsonwebtoken');
router.post("/sendVerificationMail",sendOtp);
router.post("/createNewAccount",signUp);
router.post("/login",logIn)
module.exports = router