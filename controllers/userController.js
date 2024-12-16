require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { userSignupSchema } = require("../utils/validations/user");
const { STATUS_CODES, MESSAGES } = require("../utils/config/constent");
const { generateOTP, sendOtp } = require("../utils/config/helper");
const JWT_SECRET = process.env.JWT_SECRET;

//User Sign up Api
exports.signup = async (req, res, next) => {
  // Validate request body
  const result = userSignupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: false,
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: MESSAGES.USER.VALIDATION_FAILED,
      errors: result.error.errors,
    });
  }

  const { password, contactNumber, ...rest } = result.data;

  try {
    // Check if contact number already exists
    const existingUser = await User.findOne({ contactNumber });
    if (existingUser) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.CONTACT_ALREADY_EXISTS,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = await generateOTP();

    // Send OTP to the user's contact number
    // await sendOtp(otp, contactNumber);

    // Create new user
    const newUser = new User({
      ...rest,
      contactNumber,
      password: hashedPassword,
      otp,
    });
    await newUser.save();

    res.status(STATUS_CODES.CREATED).json({
      status: true,
      statusCode: STATUS_CODES.CREATED,
      message: MESSAGES.USER.OTP_SENT,
      otp,
    });
  } catch (error) {
    next(error);
  }
};
// user otp verify
exports.verifyOtp = async (req, res, next) => {
  const { contactNumber, otp } = req.body;
  try {
    // Check if user exists with the provided contact number
    const user = await User.findOne({ contactNumber });
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        message: MESSAGES.USER.NOT_FOUND,
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        status: false,
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: MESSAGES.USER.INVALID_OTP,
      });
    }

    // OTP verified, generate temporary token for password reset
    const tempToken = jwt.sign(
      { id: user._id, action: "resetPassword" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token valid for 15 minutes
    );

    // Verify the user and clear OTP
    user.isVerified = true;
    user.otp = undefined; // Clear OTP after successful verification
    await user.save();

    res.status(STATUS_CODES.SUCCESS).json({
      status: true,
      statusCode: STATUS_CODES.SUCCESS,
      message: MESSAGES.USER.OTP_VERIFIED,
      tempToken,
    });
  } catch (error) {
    next(error);
  }
};
//user logIn api
exports.signin = async (req, res, next) => {
  try {
    // Extract contact number and password from the request body
    const { number, password } = req.body;

    // Find user by contact number
    const user = await User.findOne({ number });

    // Check if user exists
    if (!user) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.INVALID_CREDENTIALS,
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        status: false,
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "User is not verified. Please verify your account.",
      });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.INVALID_CREDENTIALS,
      });
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: "6h",
      }
    );

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Return success response with the token
    res.status(STATUS_CODES.SUCCESS).json({
      status: true,
      statusCode: STATUS_CODES.SUCCESS,
      message: MESSAGES.USER.USER_SIGNED_IN,
      token,
    });
  } catch (error) {
    next(error);
  }
};
// Forgot Password API
exports.forgotPassword = async (req, res, next) => {
  try {
    const { contactNumber } = req.body;

    // Find the user by contact number
    const user = await User.findOne({ contactNumber });
    if (!user) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.NOT_FOUND,
      });
    }

    // Generate OTP
    const otp = await generateOTP();

    // Save OTP in the user's document
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP to the user's contact number
    await sendOtp(otp, contactNumber);

    res.status(STATUS_CODES.SUCCESS).json({
      status: true,
      statusCode: STATUS_CODES.SUCCESS,
      message: MESSAGES.USER.OTP_SENT,

    });
  } catch (error) {
    next(error);
  }
};
// Reset Password Api
exports.resetPassword = async (req, res, next) => {
  try {
    const { tempToken, password } = req.body;

    // Verify temporary token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    if (decoded.action !== "resetPassword") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.INVALID_TOKEN,
      });
    }

    // Find user by ID from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        status: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        message: MESSAGES.USER.USER_NOT_FOUND,
      });
    }

    // Hash the new password
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(STATUS_CODES.SUCCESS).json({
      status: true,
      statusCode: STATUS_CODES.SUCCESS,
      message: MESSAGES.USER.PASSWORD_RESET_SUCCESS,
    });
  } catch (error) {
    // Handle token expiration or invalid token errors
    if (error.name === "TokenExpiredError") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: MESSAGES.USER.TOKEN_EXPIRED,
      });
    }
    next(error);
  }
};
