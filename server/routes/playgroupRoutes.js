const express = require("express");
const {
  createPlaygroup,
  addMember,
  getPlaygroupPlayers,
} = require("../controllers/playgroupController");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// requireAuth middleware
router.use(requireAuth);

router.post("/", createPlaygroup); // Create a playgroup
router.put("/addMember", addMember); // Add a member to a playgroup
router.get("/players/:playgroupId", getPlaygroupPlayers); // Get players in a playgroup

module.exports = router;
