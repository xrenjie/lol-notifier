import React, { useState } from "react";
import SummonerInput from "./SummonerInput";
import { useWebhookContext } from "../../utils/WebhookContext";

const regions = [
  "br1",
  "eun1",
  "euw1",
  "jp1",
  "kr",
  "la1",
  "la2",
  "na1",
  "oc1",
  "ru",
  "tr1",
];

const SummonerRow = ({ summoner, index }) => {
  const { setSummoners, summoners } = useWebhookContext();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleChangeRegion = (e) => {
    let newSummoners = summoners;
    newSummoners[index].region = e.target.value;
    setSummoners(newSummoners);
  };

  const handleDelete = (e) => {
    let newSummoners = summoners.filter((sum, i) => summoner._id !== sum._id);
    setSummoners(newSummoners);
  };

  return (
    <div className="flex flex-row text-lg my-2 gap-2">
      <SummonerInput summonerName={summoner.name} index={index} />
      <select
        className="border"
        defaultValue={summoner.region}
        onChange={handleChangeRegion}
      >
        {regions.map((region) => {
          return (
            <option key={region} value={region}>
              {region.toUpperCase()}
            </option>
          );
        })}
      </select>
      {!confirmDelete ? (
        <button
          onClick={() => {
            setConfirmDelete(true);
          }}
          className="drop-shadow bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          X
        </button>
      ) : (
        <div className="flex flex-row gap-2">
          <button
            onClick={() => {
              setConfirmDelete(false);
            }}
            className="drop-shadow bg-gray-100 hover:bg-gray-200 font-bold py-2 px-4 rounded"
          >
            X
          </button>
          <button
            onClick={handleDelete}
            className="drop-shadow bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default SummonerRow;

//Component includes SummonerInput to the left and RegionSelector to the right, with a last button to delete on the far right
