const mongoose = require("mongoose");
const config = require("../config/config");

// Create connection to MongoDB that can be used throughout the application
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
