const mongoose = require("mongoose");
const MailSender = require('../Helpers/MailSender');
const otpSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      trim: true
   },
   otp: {
      type: Number,
      required: true,
   }, 
   createdAt: {
      type: Date,
      default: Date.now,
      expires: 300000 // 5 minutes in milliseconds
  }
});
async function sendVerificationEmail(email, otp) {
   try {
      const mailResponse = await MailSender(email, " verification email from Adverse Platform ", otp);
      console.log("Email sent succesfully")
   }
   catch (err) {
      console.log("error while sending the verification email");
      throw err;
   }
}
otpSchema.pre("save", async function (next) {
   if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
   next();
});
module.exports = mongoose.model("OTP", otpSchema); 