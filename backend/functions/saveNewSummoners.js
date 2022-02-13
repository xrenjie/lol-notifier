const axios = require("axios");
const { workerData } = require("worker_threads");
const mongoose = require("mongoose");
const Summoner = require("../models/summoner.model");

//this is a worker thread started by discord.js
const summoners = workerData;

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true });

summoners.forEach((summonerNameWithRegion) => {
  setTimeout(() => {
    //summoner name in format of "summonerName#region"

    let region = summonerNameWithRegion.slice(
      summonerNameWithRegion.indexOf("#") + 1
    );
    let summonerName = summonerNameWithRegion.slice(
      0,
      summonerNameWithRegion.indexOf("#")
    );
    axios
      .get(
        `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
        { headers: { "X-Riot-Token": process.env.RIOT_API_KEY } }
      )
      .then(({ data }) => {
        //if summoner is already in db, update entry otherwise insert new document
        Summoner.findOneAndUpdate(
          { summonerId: data.id },
          {
            summonerId: data.id,
            accountId: data.accountId,
            puuId: data.puuid,
            summonerName: summonerNameWithRegion,
            profileIconId: data.profileIconId,
            revisionDate: data.revisionDate,
            summonerLevel: data.summonerLevel,
            hasAttachedWebhooks: true,
            lastQueried: new Date("1970-01-01"),
            lastGameId: 0,
          },
          { upsert: true }
        ).catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, 5000);
  //process one every 5 seconds to avoid api rate limit
});
