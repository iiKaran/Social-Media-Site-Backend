const nodemailer = require("nodemailer"); 
const MailSender = async (email,title , body)=>{
 try{
  require("dotenv").config();
   let transporter = nodemailer.createTransport({
    // host:process.env.HOST,
    service:"Gmail",
    auth:{
      user:'notionstudy566@gmail.com', 
      pass:'pnuikthpxgangtpm'
    }

   })
   
   let info = await transporter.sendMail({
    to: `${email}`, 
    from:`Adverse - Karan Sehgal`, 
    subject:`${title}`, 
    html : `Otp for the Adverse Account is ${body}. Dont share this otp with anyone else.`
   }); 
   return info;
 }
 catch(err){
  console.log(err); 
  return ;
 }
}
module.exports = MailSender;