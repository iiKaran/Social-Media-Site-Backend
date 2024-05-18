const colors = require("colors/safe");
const express = require("express");
const authRoutes = require("./Routes/AuthRoutes");
const contentRoutes = require("./Routes/ContentRoutes")
const accountRoutes = require("./Routes/AccountRoutes")
require("dotenv").config();
const connectDB = require("./Config/DbConnection")
const fileUpload = require("express-fileupload");
const cors = require("cors"); 
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 8000; // port selection
const app = express(); // instance of the express server 
const  clouldinaryConnect = require("./Config/CloudinaryConfig");
const {deleteInactiveAccounts} = require("./Controllers/DeleteAccount");
const cron = require('node-cron');
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
let cnt = 0 ; 
cron.schedule('*/5 * * * * *', async () => {
    // daily running task to delete all the account which is inactive from 30 days 
    console.log("run")
    await deleteInactiveAccounts();
})

// live
app.use("/toodle/api/auth", authRoutes)
app.use("/toodle/api/content",contentRoutes)
app.use("/toodle/api/account",accountRoutes)
app.listen(port, console.log(colors.magenta(`Server started on port ${port}`)));
