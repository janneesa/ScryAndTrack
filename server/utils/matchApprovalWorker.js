const cron = require("node-cron");
const Match = require("../models/matchModel");
const { deleteMatch, approveMatch } = require("../controllers/matchController");

const checkMatches = async () => {
  await deleteOldMatches();
  await approveOldMatches();
};

// Function to check and delete rejected matches older than 24 hours
const deleteOldMatches = async () => {
  console.log("Checking for matches to delete...");
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  try {
    const matches = await Match.find({
      status: "rejected",
      createdAt: { $lte: twentyFourHoursAgo },
    });

    for (const match of matches) {
      console.log(`Match ${match._id} is eligible for deletion`);
      await deleteMatch(match._id);
    }
  } catch (error) {
    console.error("Error deleting matches:", error);
  }
};

// Function to check and approve pending matches older than 24 hours
const approveOldMatches = async () => {
  console.log("Checking for matches to approve...");
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  try {
    const matches = await Match.find({
      status: "pending",
      createdAt: { $lte: twentyFourHoursAgo },
    });

    for (const match of matches) {
      console.log(`Match ${match._id} is eligible for approval`);
      await approveMatch(match);
    }
    console.log("Done approving matches");
  } catch (error) {
    console.error("Error approving matches:", error);
  }
};

// Schedule job to run every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  await approveOldMatches();
});

module.exports = checkMatches;
