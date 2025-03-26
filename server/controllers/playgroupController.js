const mongoose = require("mongoose");
const Playgroup = require("../models/playgroupModel");
const User = require("../models/userModel");

// @desc Create a new playgroup
// @route POST /api/playgroups
// @access Private
const createPlaygroup = async (req, res) => {
  try {
    const { name, admin } = req.body;

    // Check if admin is a valid user
    if (!mongoose.Types.ObjectId.isValid(admin)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const playgroup = await Playgroup.createPlaygroup(name, admin);
    res.status(201).json(playgroup);
  } catch (error) {
    res.status(500).json({ error: error, details: error.message });
  }
};

// @desc addMember
// @route PUT /api/playgroups/addMember/
// @access Private
const addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    // Check if memberId is a valid user
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const playgroup = await Playgroup.findById(groupId);
    if (!playgroup) {
      return res.status(404).json({ error: "Playgroup not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is already a member
    if (playgroup.members.includes(userId)) {
      return res.status(400).json({ error: "User is already a member" });
    }

    // Check if user doing the adding is the admin
    if (req.user.id !== playgroup.admin.toString()) {
      return res.status(401).json({ error: "Only admin can add members" });
    }

    playgroup.members.push(userId);
    await playgroup.save();

    res.json(playgroup);
  } catch (error) {
    res.status(500).json({ error: error, details: error.message });
  }
};

module.exports = { createPlaygroup, addMember };
