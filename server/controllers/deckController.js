const mongoose = require("mongoose");
const Deck = require("../models/deckModel");
const { find } = require("../models/userModel");

// @desc Create a new deck
// @route POST /api/decks
// @access Private
const createDeck = async (req, res) => {
  const id = req.user.id;

  try {
    const { name, commander, colors } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deck = await Deck.newDeck(id, name, commander, colors);
    res.status(201).json(deck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Get a deck by ID
// @route GET /api/decks/:id
// @access Private
const getDeckById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid deck ID" });
    }

    const deck = await Deck.findById(req.params.id).populate("owner");
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }
    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Update a deck by ID
// @route PUT /api/decks/:id
// @access Private
const updateDeck = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid deck ID" });
    }

    const deck = await Deck.findById(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }
    if (deck.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    Object.assign(deck, req.body);
    const updatedDeck = await deck.save();
    res.json(updatedDeck);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Delete a deck by ID
// @route DELETE /api/decks/:id
// @access Private
const deleteDeck = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid deck ID" });
    }

    const deck = await Deck.findById(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    if (deck.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Deck.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Deck deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Used by matchApprovalWorker to update winning decks stats
const updateWinnerDeckStats = async (match, session) => {
  const { winner } = match;

  try {
    const deck = await Deck.findById(winner.deckId).session(session);
    if (!deck) {
      console.error(`Deck ${winner.deckId} not found`);
      return false;
    }

    const updatedDeck = {
      winRate: (((deck.wins + 1) / (deck.games + 1)) * 100).toFixed(2),
      games: deck.games + 1,
      wins: deck.wins + 1,
    };

    Object.assign(deck, updatedDeck);
    await deck.save({ session });
    return true;
  } catch (error) {
    console.error(`Error updating deck ${winner.deckId}:`, error);
    return false;
  }
};

// @desc Used by matchApprovalWorker to update losing decks stats
const updateLoserDeckStats = async (match, session) => {
  const { losers } = match;

  try {
    for (const deckId of losers.values()) {
      const deck = await Deck.findById(deckId).session(session);
      if (!deck) {
        console.error(`Deck ${deckId} not found`);
        return false;
      }

      const updatedDeck = {
        winRate: ((deck.wins / (deck.games + 1)) * 100).toFixed(2),
        games: deck.games + 1,
      };

      Object.assign(deck, updatedDeck);
      await deck.save({ session });
    }
    return true;
  } catch (error) {
    console.error(`Error updating deck ${deckId}:`, error);
    return false;
  }
};

module.exports = {
  createDeck,
  getDeckById,
  updateDeck,
  deleteDeck,
  updateWinnerDeckStats,
  updateLoserDeckStats,
};
