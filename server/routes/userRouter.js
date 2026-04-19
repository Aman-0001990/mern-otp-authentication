import express from "express";
import { register, verifyOTP, login, logout, getUser, forgetPassword, resetPassword } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/register", register);

router.post("/otp-verification", verifyOTP);

router.post("/login", login);

router.get("/logout", isAuthenticated, logout);

router.get("/me", isAuthenticated, getUser);

router.post("/password/forget", forgetPassword);
router.put("/password/reset/:token", resetPassword);

export default router;