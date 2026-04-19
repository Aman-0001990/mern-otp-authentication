🔐 MERN Authentication System with OTP Verification
🌐 Live Demo

🚀 Frontend (Live App):
👉 https://portfolio-aman-1.netlify.app/

🚀 Overview

This project is a full-stack authentication system built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

It provides secure and scalable authentication with OTP verification via Email and Phone, along with production-level backend features like middleware, error handling, and cron automation.

🧠 Features
✅ User Registration & Login
🔐 Password Hashing using bcrypt
📩 OTP Verification (Email & Phone Call)
🔁 Forgot Password & Reset Password
🍪 JWT Authentication with Cookies
⚠️ Global Error Handling Middleware
⏱️ Cron Job for Removing Unverified Users
📦 Clean Backend Architecture (MVC Pattern)
🛠️ Tech Stack
💻 Frontend
React.js
Axios
Tailwind CSS
⚙️ Backend
Node.js
Express.js
MongoDB (Mongoose)
🔐 Authentication & Tools
JWT (JSON Web Token)
bcrypt
cookie-parser
dotenv
Nodemailer (Email OTP)
Twilio (Phone OTP via call)
node-cron
📁 Project Structure
server/
│
├── config/
│   └── config.env
│
├── database/
│   └── dbConnection.js
│
├── middlewares/
│   ├── error.js
│   └── catchAsyncError.js
│
├── models/
│   └── userModel.js
│
├── controllers/
│   └── userController.js
│
├── app.js
├── server.js
└── package.json
⚙️ Installation & Setup
# Clone repository
git clone https://github.com/your-username/your-repo-name.git

# Move into server folder
cd server

# Install dependencies
npm install

# Start development server
npm run dev
🔐 Environment Variables (config.env)
PORT=4000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173

EMAIL_USER=your_email
EMAIL_PASS=your_password

TWILIO_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=your_number
🔄 API Endpoints
Method	Endpoint	Description
POST	/register	Register user
POST	/login	Login user
POST	/verify-otp	Verify OTP
POST	/forgot-password	Send reset link
POST	/reset-password	Reset password
🔐 Authentication Flow
User registers → OTP sent (Email/Phone)
User verifies OTP → Account activated
User logs in → JWT stored in cookies
Protected routes validate token via middleware
⚠️ Error Handling

A centralized error handling system manages:

Invalid JWT
Expired Token
Duplicate Email/Phone
Validation Errors
⏰ Automation
⏳ Cron job automatically deletes unverified users after 30 minutes
📌 Future Improvements
🔑 Google OAuth Login
🚫 Rate Limiting
🔄 Refresh Tokens
👥 Role-Based Authentication
👨‍💻 Author

Aman Rohilla
MERN Stack Developer

🌐 Portfolio:
👉 https://portfolio-aman-1.netlify.app/
