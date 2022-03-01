import React, { useState } from "react";
import SearchBar from "./SearchBar";
import WebhookInfoDisplay from "./WebhookInfoDisplay";
import SummonerTable from "./SummonerTable";
import Loader from "./Loader";
import { useWebhookContext } from "../../utils/WebhookContext";

const SubscribePage = () => {
  const { loading, loaded } = useWebhookContext();
  const [id, setId] = useState(0);

  return (
    <div className="w-[60vw] my-20 ">
      {loaded ? null : <SearchBar id={id} setId={setId} />}
      {loading ? <Loader /> : null}
      {loaded ? (
        <>
          <WebhookInfoDisplay />
          <SummonerTable id={id} setId={setId} />
        </>
      ) : null}
    </div>
  );
};

export default React.memo(SubscribePage);

//Component includes SearchBar when no input,
//Searchbar disappears and replaced with WebhookInfoDisplay with webhook name and button to apply changes at top
//When webhook has been entered, SummonerTable is below WebhookInfoDisplay.
