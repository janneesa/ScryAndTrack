const mongoose = require("mongoose");
const Match = require("../models/matchModel");

// @desc Create a new match
// @route POST /api/matches
// @access Private
const createMatch = async (req, res) => {
  try {
    const { playerDecks, winner } = req.body;

    // Create a new match
    const match = new Match({
      playerDecks,
      winner,
    });

    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// @desc Delete a match by ID
// @route DELETE /api/matches/:id
// @access Private
const deleteMatch = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid match ID" });
    }

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    await Match.findByIdAndDelete(id);
    res.status(204).json({ message: "Match deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { createMatch, deleteMatch };
