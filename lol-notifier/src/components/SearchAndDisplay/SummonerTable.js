import React, { useState } from "react";
import axios from "axios";
import { useWebhookContext } from "../../utils/WebhookContext";
import SummonerRow from "./SummonerRow";
import { ReactComponent as CheckMark } from "../../assets/check-mark.svg";

const SummonerTable = () => {
  const { summoners, setSummoners, webhookUrl } = useWebhookContext();
  const [submitted, setSubmitted] = useState(false);

  const handleAddSummoner = () => {
    setSummoners([
      ...summoners,
      { name: "", region: "na1", _id: Math.random() },
    ]);
  };

  const handleSubmit = () => {
    let summonersToSend = summoners.filter((summoner) => {
      return summoner.name.length >= 3;
    });
    axios
      .put(`${process.env.REACT_APP_SERVER_URL}/edit`, {
        webhook: webhookUrl,
        summoners: summonersToSend,
      })
      .then((res) => {
        if (res.status === 200) {
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="my-16 flex flex-col">
      <div className="grid grid-cols-6">
        <button
          className="drop-shadow bg-blue-500 hover:bg-blue-600 text-white py-2 col-span-2 m-4 text-xl"
          onClick={handleAddSummoner}
        >
          Add Summoner
        </button>
        <button
          className="drop-shadow bg-green-500 hover:bg-green-600 text-white py-2 col-span-4 text-xl m-4 text-center"
          onClick={handleSubmit}
        >
          {submitted ? (
            <CheckMark className="fill-white h-6 w-6 left-1/2 absolute bottom-1/4" />
          ) : (
            "Apply Changes"
          )}
        </button>
      </div>
      {summoners.map((summoner, index) => {
        return (
          <SummonerRow key={summoner._id} summoner={summoner} index={index} />
        );
      })}
    </div>
  );
};

export default SummonerTable;

//Component makes list of all SummonerRow components
