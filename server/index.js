require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
