const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpiry: {
      type: Date, // Store the expiry time as a Date
      required: false, // Optional, as it will only be set during OTP generation
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
