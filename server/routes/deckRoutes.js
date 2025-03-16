const express = require("express");
const {
  createDeck,
  getDeckById,
  updateDeck,
  deleteDeck,
} = require("../controllers/deckController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// requireAuth middleware
router.use(requireAuth);

router.post("/", createDeck); // Create a deck
router.get("/:id", getDeckById); // Fetch deck by ID
router.put("/:id", updateDeck); // Update deck by ID
router.delete("/:id", deleteDeck); // Delete deck by ID

module.exports = router;
