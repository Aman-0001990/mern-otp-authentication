import dotenv from 'dotenv'
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from '../utils/sendToken.js';
import { assign } from 'nodemailer/lib/shared/index.js';
import crypto from "crypto";
// if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
//     console.warn("Twilio environment variables are missing or incomplete.");
// }
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password, phone, verificationMethod } = req.body;
        if (!name || !email || !password || !verificationMethod) {
            return next(new ErrorHandler("ALL FIELDS ARE REQUIRED. ", 400));
        }
        function validatePhoneNumber(phone) {
            const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
            return phoneRegex.test(phone);
        }

        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        if (!validatePhoneNumber(phone)) {
            return next(new ErrorHandler("Invaild Phone Number.", 400));
        }
        if (!isValidEmail(email)) {
            return next(new ErrorHandler("Invalid email address.", 400));
        }
        const exisitingUser = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true,
                },
                {
                    phone,
                    accountVerified: true,
                },

            ]
        });
        if (exisitingUser) {
            return next(new ErrorHandler("User is already register.", 400));
        }
        const registerationAttemptsByUser = await User.find({
            $or: [
                { phone, accountVerified: false },
                { email, accountVerified: false },
            ]
        });

        if (registerationAttemptsByUser.length > 3) {
            return next(new ErrorHandler("You have exceeded the maximum number of attempts (3). Please try again after an hour.", 400));
        }

        const userData = { name, email, phone, password };
        const user = await User.create(userData);

        const verificationCode = await user.generateVerificationCode();
        await user.save();
        await sendVerificationCode(verificationMethod, name, verificationCode, phone, email, res);

    } catch (error) {
        next(error);

    }
})


async function sendVerificationCode(verificationMethod, name, verificationCode, phone, email, res) {
    try {
        if (verificationMethod == "email") {
            const message = generateEmailTemplate(verificationCode, name);
            await sendEmail({ email, subject: "You verification code", message });
            res.status(200).json({
                success: true,
                message: `Verification email successfully sent to ${name}`
            });
        } else if (verificationMethod == "phone") {
            const verificationCodewithSpace = verificationCode.toString().split("").join(" ");
            const normalizedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
            await client.calls.create({
                twiml: `<Response>
            <Say>
            Your verification code is ${verificationCodewithSpace}. 
            Your verification code is ${verificationCodewithSpace}. 
            </Say>
            </Response>`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: normalizedPhone
            });
            res.status(200).json({
                success: true,
                message: "OTP sent "
            });
        }
        else {
            return res.status(500).json({
                success: false,
                message: "Invalid verification method.",
            })
        }
    } catch (error) {
        console.error("sendVerificationCode error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Verification code failed to send.",
            error: error.message,
        })
    }

}

function generateEmailTemplate(verificationCode, name) {
    return `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px;">
    
    <h2 style="text-align: center; color: #333;">Email Verification</h2>
    
    <p>Hi <b>${name}</b>,</p>
    
    <p>Use the following code to verify your email:</p>
    
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 28px; font-weight: bold; color: #2c3e50;">
        ${verificationCode}
      </span>
    </div>
    
    <p>This code will expire in <b>10 minutes</b>.</p>
    
    <p style="color: #888; font-size: 12px;">
      If you didn’t request this, you can ignore this email.
    </p>
    
    <hr />
    
    <p style="text-align: center; font-size: 12px; color: #aaa;">
      © 2026 Your App Name
    </p>
    
  </div>
</div>`;
}





export const verifyOTP = catchAsyncError(async (req, res, next) => {
    const { email, otp, phone } = req.body;

    function validatePhoneNumber(phone) {
        const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    }
    if (!validatePhoneNumber(phone)) {
        return next(new ErrorHandler("Invaild Phone Number.", 400));
    }

    try {
        const userAllEntries = await User.find({
            $or: [
                {
                    email, accountVerified: false,

                },
                {
                    phone, accountVerified: false,

                },
            ]
        }).sort({ createdAt: -1 });

        if (!userAllEntries) {
            return next(new ErrorHandler("User Not found", 404));

        }

        let user;
        if (userAllEntries.length > 1) {
            user = userAllEntries[0];
            await User.deleteMany({
                _id: { $ne: user._id },
                $or: [
                    {
                        email, accountVerified: false,

                    },
                    {
                        phone, accountVerified: false,

                    },
                ]
            });
        }
        else {
            user = userAllEntries[0];
        }

        if (user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP.", 400));

        }

        const currentTime = Date.now();
        const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

        
        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP Expired.", 400));
        }

        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;
        await user.save({ validateModifiedOnly: true });

        sendToken(user, 200, "Account Verified.", res);

    } catch (error) {
        return next(new ErrorHandler("Internal Server Error", 500));
    }
})


export const login = catchAsyncError(async (req, res, next) => {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Email and password are required", 400));
    }
    console.log("Finding user with email:", email);
    const user = await User.findOne({ email, accountVerified: true }).select("+password");
    console.log("User found:", user ? "Yes" : "No");
    if (!user) {
        return next(new ErrorHandler("Invalid email and password", 400))
    }

    console.log("Comparing passwords");
    const isPasswordMatched = await user.comparePasswords(password);
    console.log("Password matched:", isPasswordMatched);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email and password", 400));
    }
    console.log("Sending token");
    sendToken(user, 200, "User logged in successfully.", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully.",
    });
})


export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })
})

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
        accountVerified: true,
    });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email please ignore it.`;

    try {
        sendEmail({
            email: user.email, subject: "Aman na reset password request approved kar di h ", message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message ? error.message : "Aman na reset password request approved nahi ki", 500))
    }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {

    const { token } = req.params;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("Reset Password token is invalid or has been expired.", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password & confirm password do not match.", 400));
    }
    user.password =  req.body.password;

    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    sendToken(user,200,"Reset Password Successfully.",res);
})