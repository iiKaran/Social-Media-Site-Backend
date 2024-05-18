const User = require("../models/User");
const OTP = require("../models/Otp");
const jwt = require("jsonwebtoken");
const colors = require("colors/safe");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const MailSender = require("../Helpers/MailSender");

exports.sendOtp = async (request, response) => {
  try {
    // fetched email
    const { email } = request.body;
    console.log("request", email);

    // check if user exist or not
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return response.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log(otp);
    // verify that otp is unique
    let checkOtp = await OTP.findOne({ otp: otp });
    while (checkOtp) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      checkOtp = await OTP.findOne({ otp: otp });
      console.log("inside");
    }
    // mail chli gyi
    const saved = OTP.create({
      email,
      otp,
    });
    const otpPayload = { email, otp };
    console.log("OTP Body", otpPayload);
    return response.status(200).json({
      success: true,
      message: "Otp Sent Successfully",
    });
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Failed to Send Otp",
    });
  }
};

exports.signUp = async (request, response) => {
  try {
    const { username, email, otp, password, confirmPassword } = request.body;

    if (!username || !email || !password || !confirmPassword || !otp) {
      return response.status(400).json({
        success: false,
        message: " All Fields Are Mandatory",
      });
    }

    // 2 password match
    if (confirmPassword !== password) {
      return response.status(404).json({
        success: false,
        message: "Both passwords are not same",
      });
    }

    // check if user exist or not
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return response.status(400).json({
        success: false,
        message: "User Already exists with this email",
      });
    }
    // fetch the recent otp  and match with input otp
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // console.log("Recent otp", recentOtp);
    if (recentOtp.length === 0) {
      return response.status(400).json({
        success: false,
        message: "OTP Not Found",
      });
    }
    // console.log(type(recentOtp.otp))
    if (recentOtp[0].otp == otp) {
      const hashedPassword = await bcrypt.hash(password, 10);
      // store it to db
      const fullName = username;
      const parts = fullName.split(" ");
      const firstName = parts[0];
      const lastName = parts[1];
      const signedUp = await User.create({
        username,
        email,
        password: hashedPassword,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      });
      // return response
      return response.status(200).json({
        success: true,
        message: " User is Registered Successfully",
      });
    } else {
      return response.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Failed to Sign Up Something went wrong",
    });
  }
};

exports.logIn = async (request, response) => {
    // fetch
    try {
        const { email, password } = request.body;
        // validate
        if (!email || !password) {
            return response.status(403).json({
                success: false,
                message: "All fields required",
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(401).json({
                success: false,
                message: "User is not Registered please sign up",
            })
        }
        // Generate JWT token and Compare Password
        if (await bcrypt.compare(password, user.password)) {
            require("dotenv").config();
            const payload = {
                email: user.email,
                id: user._id,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            user.token = token;
            user.password = undefined;
            // create a cookie 
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
           return response.cookie("token", token, options).status(200).json({
                success: true,
                token,
                message: " login succed"
            })
        }
        else {
            response.status(400).json({
                success: false,
                message: "Password Incorrect"
            })
        }
    }
    catch (err) {
        console.log(colors.red(err))
        response.status(500).json({
            success: false,
            message: "Eroor Ocurred"
        })
    }
}