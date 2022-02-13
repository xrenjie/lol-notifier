const router = require("express").Router();
const axios = require("axios");
const { Worker, workerData } = require("worker_threads");
const childProcess = require("child_process");

const Discord = require("../models/discord.model");
const Summoner = require("../models/summoner.model");

//get summoner names attached to existing webhook
router.route("/get").get((req, res) => {
  Discord.find({ webhook: req.body.webhook })
    .then((discord) => res.json(discord.summonerNames))
    .catch((err) => res.status(400).json("Error: " + err));
});

//add new discord webhook and corresponding summoner name(s)
router.route("/add").post((req, res) => {
  const webhook = req.body.webhook;
  const receivedSummoners = req.body.summoners;

  let summoners = receivedSummoners.map((summoner) => {
    return summoner.summonerName.toLowerCase() + "#" + summoner.region;
  });

  const newDiscord = new Discord({
    webhook,
    summoners,
  });

  newDiscord
    .save()
    .then(() => res.json("Discord webhook added!"))
    .catch((err) => res.status(400).json("Error: " + err));

  //run worker thread to fetch summoner details and save to db
  //new Worker("../functions/saveSummoners.js")

  const worker = new Worker("./functions/saveNewSummoners.js", {
    workerData: summoners,
  });
});

//edit summoner names attached to existing webhook
//run worker thread to check removed summoner for any more attached webhooks
//if no more webhooks, mark summoner hasAttachedWebhooks=false
//run worker thread to mark added summoners hasAttachedWebhooks=true
router.route("/edit").put((req, res) => {
  const webhook = req.body.webhook;
  const receivedSummoners = req.body.summoners;

  let summoners = receivedSummoners.map((summoner) => {
    return summoner.summonerName.toLowerCase() + "#" + summoner.region;
  });

  Discord.findOneAndUpdate(
    { webhook: webhook },
    { summoners: summoners },
    { upsert: true }
  )
    .then((discord) => {
      res.json("Discord webhook updated!");
      let oldSummoners = discord.summoners;
      let removedSummoners = oldSummoners.filter((summoner) => {
        return !summoners.includes(summoner);
      });

      if (removedSummoners.length > 0) {
        const worker1 = new Worker(
          "./functions/checkSummonersStillTracked.js",
          {
            workerData: removedSummoners,
          }
        );
      }

      let newSummoners = summoners.filter((summoner) => {
        return !oldSummoners.includes(summoner);
      });

      if (newSummoners.length > 0) {
        const worker2 = new Worker("./functions/saveNewSummoners.js", {
          workerData: newSummoners,
        });
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//remove existing webhook and corresponding summoner name(s)
//run worker thread to check removed summoner for any more attached webhooks
//if no more webhooks, mark summoner hasAttachedWebhooks=false
router.route("/remove").delete((req, res) => {
  const webhook = req.body.webhook;
  let oldSummoners = [];

  Discord.find({ webhook: webhook })
    .then((discord) => {
      oldSummoners = discord.summoners;
      discord.remove().then(() => res.json("Discord webhook removed!"));
    })
    .catch((err) => res.status(400).json("Error: " + err));

  const worker = new Worker("./functions/checkSummonersStillTracked.js", {
    workerData: oldSummoners,
  });
});

module.exports = router;
