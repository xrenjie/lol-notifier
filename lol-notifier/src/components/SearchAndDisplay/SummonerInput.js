import React from "react";
import { useWebhookContext } from "../../utils/WebhookContext";

const SummonerInput = ({ summonerName, index }) => {
  const { summoners, setSummoners } = useWebhookContext();

  const handleChange = (e) => {
    let newSummoners = summoners;
    newSummoners[index].name = e.target.value;
    setSummoners(newSummoners);
  };

  return (
    <input
      className="text-xl bg-gray-100 px-4 py-2"
      type="text"
      defaultValue={summonerName}
      onChange={handleChange}
    />
  );
};

export default SummonerInput;

//Component includes text input for summoner name
