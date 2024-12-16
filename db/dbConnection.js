const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

// Connect to MongoDB using the mongoose connect method
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error in connecting to the database", err);
  });
