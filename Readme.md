# 🔐 MERN Authentication System with OTP Verification

## 🚀 Overview

This project is a **full-stack authentication system** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.
It provides secure user authentication with **OTP verification via email and phone**, along with advanced backend features like error handling, middleware, and cron automation.

🌐 **Live Portfolio:** https://portfolio-aman-1.netlify.app/

---

## 🧠 Features

* ✅ User Registration & Login
* 🔐 Password Hashing using bcrypt
* 📩 OTP Verification (Email & Phone Call)
* 🔁 Forgot Password & Reset Password
* 🍪 JWT Authentication with Cookies
* ⚠️ Global Error Handling Middleware
* ⏱️ Cron Job for Removing Unverified Users
* 📦 Clean Backend Architecture (MVC Pattern)

---

## 🛠️ Tech Stack

### Frontend:

* React.js
* Axios
* Tailwind CSS (optional)

### Backend:

* Node.js
* Express.js
* MongoDB (Mongoose)

### Authentication & Tools:

* JWT (JSON Web Token)
* bcrypt (Password hashing)
* cookie-parser
* dotenv (Environment variables)
* Nodemailer (Email OTP)
* Twilio (Phone OTP via call)
* node-cron (Automation)

---

## 📁 Project Structure

```
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
```

---

## ⚙️ Installation

```bash
# Clone repo
git clone <your-repo-url>

# Go to server folder
cd server

# Install dependencies
npm install

# Run server
npm run dev
```

---

## 🔐 Environment Variables (config.env)

```
PORT=4000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173

EMAIL_USER=your_email
EMAIL_PASS=your_password

TWILIO_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=your_number
```

---

## 🔄 API Endpoints

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| POST   | /register        | Register user   |
| POST   | /login           | Login user      |
| POST   | /verify-otp      | Verify OTP      |
| POST   | /forgot-password | Send reset link |
| POST   | /reset-password  | Reset password  |

---

## 🔐 Authentication Flow

1. User registers → OTP sent (Email/Phone)
2. User enters OTP → Account verified
3. User logs in → JWT stored in cookies
4. Protected routes use middleware to verify token

---

## ⚠️ Error Handling

* Custom Error Handler Class
* Handles:

  * Invalid JWT
  * Expired Token
  * Duplicate Email/Phone
  * Validation Errors

---

## ⏰ Automation

* Cron job removes unverified users after a fixed time (e.g., 30 mins)

---

## 📌 Future Improvements

* Google OAuth Login
* Rate Limiting
* Refresh Tokens
* Role-Based Authentication

---

## 👨‍💻 Author

**Aman Rohilla**
MERN Stack Developer

---
