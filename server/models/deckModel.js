const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deckSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    commander: { type: String, required: true, trim: true },
    colors: [{ type: String, enum: ["W", "U", "B", "R", "G"] }], // White, Blue, Black, Red, Green
  },
  {
    timestamps: true,
  }
);

deckSchema.statics.newDeck = async function (owner, name, commander, colors) {
  if (!owner && !name && !commander && !colors) {
    throw Error("All fields must be filled");
  }

  const existingName = await this.findOne({ name });
  if (existingName) {
    throw Error("Name already in use");
  }

  const deck = await this.create({ owner, name, commander, colors });

  return deck.toJSON();
};

module.exports = mongoose.model("Deck", deckSchema);
