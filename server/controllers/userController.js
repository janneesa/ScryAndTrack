const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register new user
// @route   POST /api/user/signup
// @access  Public
const createUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // Custom signup method in the User model
    const user = await User.signup(email, password, confirmPassword);

    if (user) {
      const token = generateToken(user.id);
      return res.status(201).json({ ...user, token });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    handleDuplicateError(error, res);
  }
};

// Fetch user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createUser, getUserById };
