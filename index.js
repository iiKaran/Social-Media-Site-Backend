const colors = require("colors/safe");
const express = require("express");
const authRoutes = require("./Routes/AuthRoutes");
require("dotenv").config();
const connectDB = require("./Config/DbConnection")
const fileUpload = require("express-fileupload");
const cors = require("cors"); 
const contentRoutes = require("./Routes/ContentRoutes")
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 8000; // port selection
const app = express(); // instance of the express server 
const  clouldinaryConnect = require("./Config/CloudinaryConfig");

app.use(express.json()); 
app.use(cookieParser());
app.use(
    cors({
     origin:"*", 
     credentials:true
    })
   ); 
   app.use(fileUpload({
    useTempFiles:true, 
    tempFileDir:"/tmp"
   }))
connectDB();
clouldinaryConnect();


// live
app.use("/toodle/api/auth", authRoutes)
app.use("/toodle/api/content",contentRoutes)
app.listen(port, console.log(colors.magenta(`Server started on port ${port}`)));
