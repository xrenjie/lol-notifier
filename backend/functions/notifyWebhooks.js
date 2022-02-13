const async = require("async");
const axios = require("axios");

const queue = async.queue(({ summonerName, region, webhooks }, callback) => {
  webhooks.forEach((webhook) => {
    axios.post(webhook.webhook, {
      content: summonerName + "#" + region + " is in game",
    });
  });
  //if summoner is sent here, it is in a game
  //send post request to each webhook
}, 1);

//receive object from fetch.js

process.on("message", ({ summonerNameWithRegion, webhooks }) => {
  let region = summonerNameWithRegion.slice(
    summonerNameWithRegion.indexOf("#") + 1
  );
  if (region.match(/[\d]/g)) {
    region = region.slice(0, region.length - 1);
  }

  let summonerName = summonerNameWithRegion.slice(
    0,
    summonerNameWithRegion.indexOf("#")
  );

  webhooks.forEach((webhook) => {
    axios.post(webhook.webhook, {
      content: summonerNameWithRegion + " is in a game",
      embeds: [
        {
          author: {
            name: "op.gg",
            url: `https://op.gg/summoners/${region}/${summonerName}/ingame`,
            icon_url: "https://s-lol-web.op.gg/images/reverse.rectangle.png",
          },
        },
      ],
    });
  });
});

//this will be a child process forked and started from fetch.js
