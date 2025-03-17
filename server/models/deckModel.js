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
    games: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    colors: [{ type: String, enum: ["W", "U", "B", "R", "G"] }], // White, Blue, Black, Red, Green
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
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

  const user = await mongoose.model("User").findById(owner);
  user.decks.push(deck._id);
  await user.save();

  return deck.toJSON();
};

module.exports = mongoose.model("Deck", deckSchema);
