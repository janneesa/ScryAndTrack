const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    losers: {
      type: Map,
      of: mongoose.Schema.Types.ObjectId, // { userId: deckId }
      required: true,
    },
    winner: {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      deckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deck",
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "error"],
      default: "pending",
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Match", matchSchema);
