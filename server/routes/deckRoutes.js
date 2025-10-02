const express = require("express");
const {
  createDeck,
  getDeckById,
  updateDeck,
  deleteDeck,
  getDecksByUserId,
} = require("../controllers/deckController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// requireAuth middleware
router.use(requireAuth);

router.post("/", createDeck); // Create a deck
router.get("/:id", getDeckById); // Fetch deck by ID
router.put("/:id", updateDeck); // Update deck by ID
router.delete("/:id", deleteDeck); // Delete deck by ID
router.get("/user/:id", getDecksByUserId); // Fetch all decks by user ID

module.exports = router;
