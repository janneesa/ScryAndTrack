const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
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

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    if (user) {
      const token = generateToken(user.id);

      res.status(200).json({ ...user, token });
    } else {
      res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Fetch user by ID
// @route   GET /api/users/:id
// @access  Private
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

// TODO: Implement the following controller functions
// @desc    Update user data
// @route   PUT /api/user/:userId
// @access  Private
const updateUser = async (req, res) => {
  const id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields with req.body
    Object.assign(user, req.body);

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createUser, loginUser, getUserById, updateUser };
