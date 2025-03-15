require("dotenv").config();
const express = require("express");
const app = express();
const {
  unknownEndpoint,
  errorHandler,
  requestLogger,
} = require("./middlewares/customMiddleware");
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(express.json());

// Use the requestLogger middleware for all routes
app.use(requestLogger);

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
