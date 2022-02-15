const async = require("async");
const axios = require("axios");
require("dotenv").config();
const childProcess = require("child_process");

const Discord = require("../models/discord.model");
const Summoner = require("../models/summoner.model");

const mongoose = require("mongoose");
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true });

const notify = childProcess.fork("./functions/notifyWebhooks.js");

//work queue
const queue = async.queue(
  ({ summonerId, webhooks, summonerName, lastGameId }, callback) => {
    //if summoner is sent here, it is tracked
    //check here if summoner is in game
    //if in game, send details to notify.js

    let region = summonerName.slice(summonerName.indexOf("#") + 1);
    setTimeout(() => {
      axios
        .get(
          `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}`,
          { headers: { "X-Riot-Token": process.env.RIOT_API_KEY } }
        )
        .then(({ data }) => {
          //if summoner is in a new game, send details to notify.js
          if (data.gameId !== lastGameId) {
            Summoner.findOneAndUpdate(
              { summonerId: summonerId },
              { lastGameId: data.gameId }
            ).catch((err) => {
              console.log("error updating summoner" + err);
            });

            //send details to notify.js to send to discord webhooks
            notify.send({
              summonerNameWithRegion: summonerName,
              webhooks: webhooks,
            });
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
          } else {
            console.log(err);
          }
        });
      callback();
    }, 3000);
    //process one every 3 seconds to satisfy api limits
  },
  1
);

/*
Checks every 10 minutes for all tracked summoners
If a summoner is tracked, it will add to queue which will query riot api for active game every 2 seconds
If a summoner is in game, check if the current game Id is different from the last game Id
If yes, then push to notify.js and notify all attached webhooks
*/
setInterval(() => {
  //find summoners that are tracked by some webhook
  //and have not been queried in 20 minutes
  Summoner.find({
    hasAttachedWebhooks: true,
    lastQueried: { $lte: new Date() - 1200000 },
  }).then((summoners) => {
    summoners.forEach((summoner) => {
      //update summoner lastQueried
      Summoner.findOneAndUpdate(
        { summonerId: summoner.summonerId },
        { lastQueried: new Date() }
      ).catch((err) => {
        console.log("error updating summoner" + err);
      });

      //find webhooks tracking the summoner
      Discord.find({
        summoners: summoner.summonerName,
      })
        .then((discords) => {
          queue.push(
            {
              summonerId: summoner.summonerId,
              webhooks: discords,
              summonerName: summoner.summonerName,
              lastGameId: summoner.lastGameId,
            },
            () => {}
          );
        })
        .catch((err) => console.log(err));
    });
  });
}, 600000);
//should be 600000 ms (10 minutes) in production

//this will be a child process forked and started from server.js
