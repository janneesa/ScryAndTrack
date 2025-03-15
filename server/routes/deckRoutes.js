const express = require("express");
const { createDeck, getDeckById } = require("../controllers/deckController");

const router = express.Router();

router.post("/", createDeck); // Create a deck
router.get("/:id", getDeckById); // Fetch deck by ID

module.exports = router;
