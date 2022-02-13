const axios = require("axios");
const { workerData } = require("worker_threads");
const mongoose = require("mongoose");
const Summoner = require("../models/summoner.model");
const Discord = require("../models/discord.model");

//this is a worker thread started by discord.js
const summoners = workerData;

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true });

summoners.forEach((summonerNameWithRegion) => {
  //summoner name in format of "summonerName#region"
  let region = summonerNameWithRegion.slice(
    summonerNameWithRegion.indexOf("#") + 1
  );
  let summonerName = summonerNameWithRegion.slice(
    0,
    summonerNameWithRegion.indexOf("#")
  );
  Discord.find({ summoners: summonerNameWithRegion }).then((discords) => {
    if (!discords.length) {
      Summoner.findOneAndUpdate(
        { summonerName: summonerNameWithRegion },
        { hasAttachedWebhooks: false }
      ).catch((err) => {
        console.log(err);
      });
    }
  });
});
