require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const {
  unknownEndpoint,
  errorHandler,
  requestLogger,
} = require("./middlewares/customMiddleware");

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to the database using the connectDB function from the config/db.js file
connectDB();

// Use the requestLogger middleware for all routes
app.use(requestLogger);

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
