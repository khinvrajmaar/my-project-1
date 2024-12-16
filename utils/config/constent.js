const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409,
  FORBIDDEN: 403,
};

const MESSAGES = {
  USER: {
    VALIDATION_FAILED: "Validation failed. Please check your input.",
    CONTACT_ALREADY_EXISTS: "A user with this contact number already exists.",
    OTP_SENT: "OTP has been sent to your contact number.",
    INVALID_OTP: "The OTP you entered is invalid.",
    OTP_VERIFIED: "OTP has been verified successfully.",
    NOT_FOUND: "No user found with the provided contact number.",
    INVALID_CREDENTIALS:
      "Invalid credentials. Please check your contact number or password.",
    USER_SIGNED_IN: "User signed in successfully.",

    INVALID_TOKEN: "Invalid token for password reset.",
    USER_NOT_FOUND: "User not found.",
    PASSWORD_RESET_SUCCESS:
      "Password reset successfully. You can now log in with your new password.",
    TOKEN_EXPIRED: "Temporary token has expired. Please verify OTP again.",
  },
};

module.exports = { STATUS_CODES, MESSAGES };
