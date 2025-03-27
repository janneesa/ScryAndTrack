require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Deck = require("../models/deckModel");
const Match = require("../models/matchModel");
const Playgroup = require("../models/playgroupModel");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    await mongoose.connect(" ");
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
  await Playgroup.deleteMany({});
  console.log("Database cleared");
};

const createTestUsers = async () => {
  const users = [
    { email: "m@example.com", username: "Eren", password: "password" },
    { email: "j@example.com", username: "Armin", password: "password" },
    { email: "s@example.com", username: "Mikasa", password: "password" },
  ];

  const createdUsers = [];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({
      email: user.email,
      username: user.username,
      password: hashedPassword,
    });
    createdUsers.push(newUser);
  }

  return createdUsers;
};

const createTestDecks = async (users) => {
  const decks = [
    {
      name: "Sauron's Army",
      commander: "Sauron, the Dark Lord",
      colors: ["U", "B", "R"],
    },
    {
      name: "Vampires of Innistrad",
      commander: "Edgar Markov",
      colors: ["W", "B", "R"],
    },
    {
      name: "Elves of Llanowar",
      commander: "Freyalise, Llanowar's Fury",
      colors: ["G"],
    },
    {
      name: "Goblins of Krenko",
      commander: "Krenko, Mob Boss",
      colors: ["R"],
    },
    {
      name: "Dragons of Tarkir",
      commander: "The Ur-Dragon",
      colors: ["W", "U", "B", "R", "G"],
    },
    {
      name: "Horror",
      commander: "Atraxa, Praetors' Voice",
      colors: ["W", "U", "B", "G"],
    },
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

const createTestPlaygroups = async (users) => {
  const planeswalkerit = await Playgroup.create({
    name: "Perjantai Planeswalkerit",
    admin: users[0].id,
    members: [users[0].id, users[1].id],
  });

  const matang = await Playgroup.create({
    name: "Mätäng Emännyys",
    admin: users[1].id,
    members: [users[1].id, users[0].id],
  });

  users[0].playgroups.push(planeswalkerit._id);
  users[1].playgroups.push(planeswalkerit._id);
  users[1].playgroups.push(matang._id);
  users[0].playgroups.push(matang._id);
  await users[0].save();
  await users[1].save();

  return [planeswalkerit, matang];
};

const seedDatabase = async () => {
  await connectDB();
  await clearDatabase();

  await createTestUsers();
  const users = await User.find({});
  await createTestDecks(users);
  const usersWithDecks = await User.find({});
  await createTestMatches(usersWithDecks);
  await createTestPlaygroups(usersWithDecks);

  console.log("Database seeded successfully");
  // console.log("Created Users:", users);
  // console.log("Created Decks:", decks);
  // console.log("Created Matches:", matches);

  process.exit();
};

seedDatabase();
