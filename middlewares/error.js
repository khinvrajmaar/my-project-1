const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Invalid data. Check your input.";
  }

  // Handle JWT errors (authentication)
  if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Unauthorized. Invalid token.";
  }

  // Customize the response
  res.status(statusCode).json({
    status: false,
    statusCode,
    message,
  });
};

module.exports = errorHandler;


