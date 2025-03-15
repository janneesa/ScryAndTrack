require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Deck = require("../models/deckModel");
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

// filepath: c:\Users\janne\Coding\vsProjects\ScryAndTrack\server\utils\seedDatabase.js
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

const seedDatabase = async () => {
  await connectDB();
  await clearDatabase();

  const users = await createTestUsers();
  const decks = await createTestDecks(users);

  console.log("Database seeded successfully");
  console.log("Created Users:", users);
  console.log("Created Decks:", decks);
  process.exit();
};

seedDatabase();
