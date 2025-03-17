require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");
const deckRoutes = require("./routes/deckRoutes");

const {
  unknownEndpoint,
  errorHandler,
  requestLogger,
} = require("./middlewares/customMiddleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Logging middleware
app.use(requestLogger);

// Define a simple route
app.get("/", (req, res) => {
  res.send("Scry & Track API is running...");
});

// Use API Routes
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/decks", deckRoutes);

// Error handling middlewares
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
