const express = require("express");
const { createMatch, rejectMatch } = require("../controllers/matchController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// requireAuth middleware
router.use(requireAuth);

router.post("/", createMatch); // Create a match
router.put("/:id", rejectMatch); // Reject a match

module.exports = router;
