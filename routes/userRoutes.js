// routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define a POST route to signup a new User
router.post("/signup1", userController.signup);
router.post("/otp-verify", userController.verifyOtp);
router.post("/signin", userController.signin);
router.post("/forgot-password", userController.forgotPassword)
router.post("/reset-password", userController.resetPassword)

module.exports = router;
