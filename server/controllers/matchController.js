const mongoose = require("mongoose");
const Match = require("../models/matchModel");
const {
  updateWinnerStats,
  updateLosersStats,
  setMostUsedDeck,
} = require("../controllers/userController");
const {
  updateWinnerDeckStats,
  updateLoserDeckStats,
} = require("../controllers/deckController");

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

// @desc Used by matchApprovalWorker to delete a match by ID
const deleteMatch = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(`Invalid match ID: ${id}`);
      return;
    }

    const match = await Match.findById(id);
    if (!match) {
      console.error(`Match ${id} not found`);
      return;
    }

    await Match.findByIdAndDelete(id);
    console.log(`Match ${id} deleted`);
  } catch (error) {
    console.error(`Error deleting match ${id}:`, error);
  }
};

// @desc Used by matchApprovalWorker to approve a match by ID
const approveMatch = async (match) => {
  const session = await mongoose.startSession(); // Start the session

  try {
    // Start a transaction
    session.startTransaction();

    // Check that match id is valid
    if (!mongoose.Types.ObjectId.isValid(match._id)) {
      throw new Error(`Invalid match ID: ${match._id}`);
    }

    // Update winner stats
    const winnerUpdated = await updateWinnerStats(match, session);
    if (!winnerUpdated) {
      throw new Error("Failed to update winner stats");
    }

    // Update loser stats
    const loserUpdated = await updateLosersStats(match, session);
    if (!loserUpdated) {
      throw new Error("Failed to update loser stats");
    }

    // Update winner deck stats
    const winnerDeckUpdated = await updateWinnerDeckStats(match, session);
    if (!winnerDeckUpdated) {
      throw new Error("Failed to update winner deck stats");
    }

    // Update loser deck stats
    const loserDeckUpdated = await updateLoserDeckStats(match, session);
    if (!loserDeckUpdated) {
      throw new Error("Failed to update loser deck stats");
    }

    // Update most used deck
    const mostUsedDeckUpdated = await setMostUsedDeck(match, session);
    if (!mostUsedDeckUpdated) {
      throw new Error("Failed to update most used deck");
    }

    // Update match status
    match.status = "approved";
    Object.assign(match, { status: "approved" });
    await match.save({ session });

    // Commit the transaction if everything went well
    await session.commitTransaction();
    console.log(`Match ${match._id} approved successfully`);
  } catch (error) {
    // If any error occurs, abort the transaction to ensure a rollback
    await session.abortTransaction();
    console.error(`Error approving match ${match._id}: ${error.message}`);
    // Set match status to error
    const updatedMatch = { status: "error" };
    Object.assign(match, updatedMatch);
    await match.save({ session });
  } finally {
    // End the session
    session.endSession();
  }
};

module.exports = { createMatch, deleteMatch, approveMatch };
