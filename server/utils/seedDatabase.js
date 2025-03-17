require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Deck = require("../models/deckModel");
const Match = require("../models/matchModel");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/scry-and-track-local");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  await User.deleteMany({});
  await Deck.deleteMany({});
  await Match.deleteMany({});
};

const createTestUsers = async () => {
  const users = [
    { email: "m@example.com", password: "password" },
    { email: "j@example.com", password: "password" },
    { email: "s@example.com", password: "password" },
  ];

  const createdUsers = [];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({
      email: user.email,
      password: hashedPassword,
    });
    createdUsers.push(newUser);
  }

  return createdUsers;
};

const createTestDecks = async (users) => {
  const decks = [
    { name: "Deck 1", commander: "Commander 1", colors: ["W"] },
    { name: "Deck 2", commander: "Commander 2", colors: ["U"] },
    { name: "Deck 3", commander: "Commander 3", colors: ["B"] },
    { name: "Deck 4", commander: "Commander 4", colors: ["R"] },
    { name: "Deck 5", commander: "Commander 5", colors: ["G"] },
    { name: "Deck 6", commander: "Commander 6", colors: ["W", "U"] },
  ];

  const createdDecks = [];

  for (let i = 0; i < decks.length; i++) {
    const user = users[i % users.length];
    const deck = await Deck.newDeck(
      user._id,
      decks[i].name,
      decks[i].commander,
      decks[i].colors
    );
    createdDecks.push(deck);
  }

  return createdDecks;
};

const createTestMatches = async (users) => {
  const matches = [
    {
      losers: new Map([
        [users[0].id, users[0].decks[0]._id],
        [users[1].id, users[1].decks[0]._id],
      ]),
      winner: {
        playerId: users[2].id,
        deckId: users[2].decks[0]._id,
      },
    },
    {
      losers: new Map([
        [users[1].id, users[1].decks[1]._id],
        [users[2].id, users[2].decks[1]._id],
      ]),
      winner: {
        playerId: users[0].id,
        deckId: users[0].decks[1]._id,
      },
    },
    {
      losers: new Map([
        [users[0].id, users[0].decks[0]._id],
        [users[2].id, users[2].decks[1]._id],
      ]),
      winner: {
        playerId: users[1].id,
        deckId: users[1].decks[0]._id,
      },
    },
  ];

  const createdMatches = await Match.insertMany(matches);
  return createdMatches;
};

const seedDatabase = async () => {
  await connectDB();
  await clearDatabase();

  await createTestUsers();
  const users = await User.find({});
  await createTestDecks(users);
  const usersWithDecks = await User.find({});
  await createTestMatches(usersWithDecks);

  console.log("Database seeded successfully");
  // console.log("Created Users:", users);
  // console.log("Created Decks:", decks);
  // console.log("Created Matches:", matches);

  process.exit();
};

seedDatabase();
