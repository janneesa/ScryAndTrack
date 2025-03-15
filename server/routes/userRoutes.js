const express = require("express");
const { createUser, getUserById } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", createUser); // Create a user
router.get("/:id", getUserById); // Fetch user by ID

module.exports = router;
