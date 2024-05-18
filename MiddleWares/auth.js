const jwt = require("jsonwebtoken");
const colors = require("colors/safe");
require("dotenv").config();
const User = require("../models/User");
// auth middle ware  
exports.auth = async (req, res, next) => {
     try {
          // extract token
          const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
          // if token is missing 
        //   console.log("the comg token", token);
          if (!token) {
               return res.status(401).json({
                    success: "False",
                    message: "Token is missing"
               })
          }
          // token verify to auntheticate
          try {
               require("dotenv").config();
               const decode = jwt.verify(token, process.env.JWT_SECRET);
               console.log("From Middle Ware",colors.magenta(decode));
               req.body.user = decode;
          }
          catch (err) {
               console.log(err);
               res.status(400).json({
                    success: false,
                    message: "Something went wrong"
               })
          }
          next();
     }
     catch (err) {
          console.log(err);
          res.status(400).json({
               success: false,
               message: "Something went wrong"
          })
     }
}