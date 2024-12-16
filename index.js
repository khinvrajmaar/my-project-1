require("dotenv").config();
const express = require("express"); // Import the Express module
const bodyParser = require("body-parser"); // Import body-parser middleware to parse request bodies
const mongoose = require("./db/dbConnection"); // Import the MongoDB connection module
const cors = require("cors"); // Import the CORS middleware to enable Cross-Origin Resource Sharing

const path = require("path");

const app = express(); // Create a new Express application


// Import route modules
const userRoutes = require("./routes/userRoutes");

const authMiddleware = require("./middlewares/auth");

// const routes = require("./routes/routes");
const errorHandler = require("./middlewares/error");

// Enable CORS for all routes
app.use(cors());

// app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 3003;

//Mount the routes
app.use("/user1", userRoutes);

// Protected routes
// app.use(authMiddleware);


//Mount routes
// app.use("/", routes);

app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is connected on port : ${PORT}`);
});
