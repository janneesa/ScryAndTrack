const express = require("express");
const { createMatch, deleteMatch } = require("../controllers/matchController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// requireAuth middleware
router.use(requireAuth);

router.post("/", createMatch); // Create a match
router.delete("/:id", deleteMatch); // Delete match by ID

module.exports = router;
