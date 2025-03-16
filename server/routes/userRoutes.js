const express = require("express");
const {
  createUser,
  loginUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/signup", createUser); // Create a user
router.post("/login", loginUser); // Login a user

router.use(requireAuth);

router.get("/:id", getUserById); // Fetch user by ID
router.put("/", updateUser); // Update user data

module.exports = router;
