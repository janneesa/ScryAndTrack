const mongoose = require("mongoose");

const playgroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin user ID
    matchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }], // List of match IDs
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of friend IDs
    timestamp: { type: Date, default: Date.now },
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

playgroupSchema.statics.createPlaygroup = async function (name, admin) {
  // Check if name is already taken
  const nameExists = await this.findOne({ name });
  if (nameExists) {
    throw Error("Playgroup name already exists");
  }

  // Check if admin already has a playgroup
  const adminHasPlaygroup = await this.findOne({ admin });
  if (adminHasPlaygroup) {
    throw Error("User can only create one playgroup");
  }

  const playgroup = await this.create({ name, admin });
  const playgroupJson = playgroup.toJson();
  return playgroupJson;
};

module.exports = mongoose.model("Playgroup", playgroupSchema);
