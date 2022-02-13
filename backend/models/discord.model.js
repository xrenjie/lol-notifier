const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const discordSchema = new Schema(
  {
    webhook: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    summoners: {
      type: [String],
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Discord = mongoose.model("Discord", discordSchema);

module.exports = Discord;
