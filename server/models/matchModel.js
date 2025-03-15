const mongoose = require("mongoose");

const matchSchema = new Schema(
  {
    players: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    decksUsed: { type: Map, of: mongoose.Schema.Types.ObjectId }, // { userId: deckId }
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Match", matchSchema);
