const cron = require("node-cron");
const Match = require("../models/matchModel");

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
      // Placeholder for approval logic
      await approveMatch(match);
    }
  } catch (error) {
    console.error("Error approving matches:", error);
  }
};

// Placeholder function for match approval logic
const approveMatch = async (match) => {
  console.log(`Approving match ${match._id}...`);
  // TODO: Implement approval logic
};

// Schedule job to run every 1 minutes
cron.schedule("*/1 * * * *", async () => {
  await approveOldMatches();
});

module.exports = approveOldMatches;
