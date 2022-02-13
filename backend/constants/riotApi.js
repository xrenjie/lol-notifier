const regions = [
  "BR1",
  "EUN1",
  "EUW1",
  "JP1",
  "KR",
  "LA1",
  "LA2",
  "NA1",
  "OC1",
  "RU",
  "TR1",
];

const summonerApiEndpoint =
  "https://<REGION>.api.riotgames.com/lol/summoner/v4/summoners/by-name/<SUMMONER_NAME>";

const spectatorApiEndpoint =
  "https://<REGION>.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/<SUMMONER_ID>";

exports.regions = regions;
exports.summonerApiEndpoint = summonerApiEndpoint;
exports.spectatorApiEndpoint = spectatorApiEndpoint;
