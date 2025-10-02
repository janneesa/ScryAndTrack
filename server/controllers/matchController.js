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
const {
  addMatchToPlaygroupHistory,
} = require("../controllers/playgroupController");

// @desc Create a new match
// @route POST /api/matches
// @access Private
const createMatch = async (req, res) => {
  try {
    const { losers, winner, playgroup } = req.body;

    if (!winner || typeof winner !== "object") {
      return res.status(400).json({ error: "Winner must be provided" });
    }

    if (!winner.playerId || !mongoose.Types.ObjectId.isValid(winner.playerId)) {
      return res.status(400).json({ error: "Invalid winner ID" });
    }

    if (!winner.deckId || !mongoose.Types.ObjectId.isValid(winner.deckId)) {
      return res.status(400).json({ error: "Invalid winner deck ID" });
    }

    if (!losers || losers.length === 0) {
      return res.status(400).json({ error: "At least 2 players is required" });
    }

    const matchData = {
      losers,
      winner,
    };

    if (playgroup !== "") {
      matchData.playgroup = playgroup;
    }

    const match = new Match(matchData);

    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Errors",
      details: error.message,
    });
  }
};

// @desc Set match status to rejected
// @route UPDATE /api/matches/:id
// @access Private
const rejectMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid match ID" });
    }

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    if (match.status !== "pending") {
      return res.status(400).json({
        error: `Match is not pending anymore. Match status: ${match.status}`,
      });
    }

    let isUserAuthorized = false;
    if (match.winner.playerId === userId) {
      isUserAuthorized = true;
    }
    if (!isUserAuthorized) {
      for (const playerId of match.losers.keys()) {
        if (playerId === userId) {
          isUserAuthorized = true;
          break;
        }
      }
    }

    if (!isUserAuthorized) {
      return res
        .status(403)
        .json({ error: "User is not authorized to edit this match" });
    }

    const updatedMatch = { status: "rejected" };
    Object.assign(match, updatedMatch);
    const rejectedMatch = await match.save();
    if (!rejectedMatch) {
      return res.status(500).json({ error: "Failed to save reject match" });
    }
    res.status(200).json(rejectedMatch);
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

    // if match was a playgroup match, update playgroup match history
    if (match.playgroup) {
      const playgroupUpdated = await addMatchToPlaygroupHistory(
        match.playgroup,
        match._id,
        session
      );
      if (!playgroupUpdated) {
        throw new Error("Failed to update playgroup match history");
      }
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

// @desc Get players recent matches
// @route GET /api/matches/recent/:id
// @access Private
const getPlayerRecentMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const matches = await Match.find({
      $or: [
        { "winner.playerId": userId },
        { [`losers.${userId}`]: { $exists: true } }, // Check if userId exists as a key in the losers map
      ],
    })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(5)
      .populate({
        path: "winner.playerId",
        model: "User",
      })
      .populate({
        path: "winner.deckId",
        model: "Deck",
      })
      .populate({
        path: "losers",
        populate: [
          {
            path: "playerId",
            model: "User",
          },
          {
            path: "deckId",
            model: "Deck",
          },
        ],
      })
      .populate({
        path: "playgroup",
        model: "Playgroup",
      });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

module.exports = {
  createMatch,
  rejectMatch,
  deleteMatch,
  approveMatch,
  getPlayerRecentMatches,
};
