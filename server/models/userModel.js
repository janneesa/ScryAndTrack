const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      select: false, // Prevent password from being returned in queries
    },
    decks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck" }], // List of deck IDs
    matchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }], // List of match IDs
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of friend IDs
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    mostPlayedDeck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
      default: null,
    },
    winRate: { type: Number, default: 0 },
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

// **Static signup method**
userSchema.statics.signup = async function (email, password, confirmPassword) {
  if (!email || !password || !confirmPassword) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Invalid email format");
  }
  if (password.length < 8) {
    throw Error("Password must be at least 8 characters long");
  }
  if (password !== confirmPassword) {
    throw Error("Passwords do not match");
  }

  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(13);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  const userObject = user.toJSON();
  delete userObject.password; // Remove the password field

  return userObject;
};

// **Static login method**
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Email and password are required");
  }

  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  const userObject = user.toJSON();
  delete userObject.password; // Remove the password field

  return userObject;
};

module.exports = mongoose.model("User", userSchema);
