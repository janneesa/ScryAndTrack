const mongoose = require("mongoose");
const Deck = require("../models/deckModel");

// Create a new deck
const createDeck = async (req, res) => {
  try {
    const { owner, name, commander, colors } = req.body;

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deck = await Deck.newDeck(owner, name, commander, colors);
    res.status(201).json(deck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch deck by ID
const getDeckById = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id).populate("owner");
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }
    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createDeck, getDeckById };
