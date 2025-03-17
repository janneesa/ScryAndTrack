const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const createUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // Custom signup method in the User model
    const user = await User.signup(email, password, confirmPassword);

    if (user) {
      const token = generateToken(user.id);
      return res.status(201).json({ ...user, token });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    handleDuplicateError(error, res);
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    if (user) {
      const token = generateToken(user.id);

      res.status(200).json({ ...user, token });
    } else {
      res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Fetch user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// TODO: Implement the following controller functions
// @desc    Update user data
// @route   PUT /api/user/:userId
// @access  Private
const updateUser = async (req, res) => {
  const id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields with req.body
    Object.assign(user, req.body);

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Used by matchController to update winning user stats
const updateWinnerStats = async (match, session) => {
  try {
    const { playerId } = match.winner;

    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      console.error(`Invalid user ID: ${playerId}`);
      return false;
    }

    const winner = await User.findById(playerId).session(session); // Pass the session

    if (!winner) {
      console.error(`Winner ${playerId} not found`);
      return false;
    }

    const updatedWinner = {
      gamesPlayed: winner.gamesPlayed + 1,
      gamesWon: winner.gamesWon + 1,
      winRate: (
        ((winner.gamesWon + 1) / (winner.gamesPlayed + 1)) *
        100
      ).toFixed(2),
      matchHistory: [...winner.matchHistory, match._id],
    };

    Object.assign(winner, updatedWinner);
    await winner.save({ session }); // Save with session
    return true;
  } catch (error) {
    console.error(`Error updating winner stats:`, error);
    return false;
  }
};

// @desc Used by matchController to update losing user stats
const updateLosersStats = async (match, session) => {
  try {
    for (const [playerId, deckId] of match.losers) {
      if (!mongoose.Types.ObjectId.isValid(playerId)) {
        console.error(`Invalid user ID: ${playerId}`);
        return false;
      }

      const loser = await User.findById(playerId).session(session); // Pass the session

      if (!loser) {
        console.error(`Loser ${playerId} not found`);
        return false;
      }

      const updatedLoser = {
        winRate: ((loser.gamesWon / (loser.gamesPlayed + 1)) * 100).toFixed(2),
        gamesPlayed: loser.gamesPlayed + 1,
        matchHistory: [...loser.matchHistory, match._id],
      };

      Object.assign(loser, updatedLoser);
      await loser.save({ session }); // Save with session
    }
    return true;
  } catch (error) {
    console.error(`Error updating loser stats:`, error);
    return false;
  }
};

// @desc Used by matchController to update most used deck
const setMostUsedDeck = async (match, session) => {
  try {
    const { winner, losers } = match;

    // Update most used deck for winner
    if (!(await updateMostUsedDeck(winner.playerId, session))) {
      return false;
    }

    // Update most used deck for each loser
    for (const [loserId] of losers) {
      if (!(await updateMostUsedDeck(loserId, session))) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error setting most used deck:", error);
    return false;
  }
};

// Helper function to find and update the most used deck for a user
const updateMostUsedDeck = async (userId, session) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error(`Invalid user ID: ${userId}`);
    return false;
  }

  const user = await User.findById(userId).populate("decks").session(session);

  if (!user || !user.decks.length) {
    console.error(`User ${userId} not found or has no decks`);
    return false;
  }

  // Determine the most used deck
  const mostPlayedDeck = user.decks.reduce((prev, current) =>
    prev.games > current.games ? prev : current
  );

  // Only update if it has changed
  if (!user.mostPlayedDeck || !user.mostPlayedDeck.equals(mostPlayedDeck._id)) {
    const updatedUser = { mostPlayedDeck: mostPlayedDeck._id };
    Object.assign(user, updatedUser);
    const updated = await user.save({ session });
    if (!updated) {
      console.error(`Error updating most used deck for user ${userId}`);
      return false;
    }
    return true;
  }
  return true;
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  updateWinnerStats,
  updateLosersStats,
  setMostUsedDeck,
};
