const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const summonerSchema = new Schema(
  {
    summonerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    accountId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    puuId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    summonerName: {
      type: String,
      required: true,
      trim: true,
    },
    profileIconId: {
      type: Number,
    },
    revisionDate: {
      type: Number,
      required: true,
    },
    summonerLevel: {
      type: Number,
      required: true,
    },
    hasAttachedWebhooks: {
      type: Boolean,
      required: true,
    },
    lastQueried: {
      type: Date,
    },
    lastGameId: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Summoner = mongoose.model("Summoner", summonerSchema);

module.exports = Summoner;
