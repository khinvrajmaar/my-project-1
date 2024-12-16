const jwt = require("jsonwebtoken");
const { STATUS_CODES, MESSAGES } = require("../utils/config/constent");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the Authorization header from the request

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Check if it exists and starts with 'Bearer '
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      status: false,
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: MESSAGES.USER.AUTH.NO_TOKEN, // Respond with an error if not
    });
  }

  const token = authHeader.split(" ")[1]; // Extract the token by splitting the header value
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the JWT secret
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
