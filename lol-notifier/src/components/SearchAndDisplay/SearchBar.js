import React from "react";
import axios from "axios";
import { ReactComponent as HelpIcon } from "../../assets/question-mark-circle.svg";
import { useWebhookContext } from "../../utils/WebhookContext";

const SearchBar = () => {
  const {
    webhookInputUrl,
    setWebhookInputUrl,
    loading,
    webhookError,
    setWebhookError,
    setWebhookUrl,
    setWebhookName,
    setLoaded,
    setLoading,
    setSummoners,
  } = useWebhookContext();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (webhookInputUrl.length === 0) {
      setWebhookError(true);
      return;
    }
    setWebhookError(false);
    if (!loading) {
      setLoading(true);
    }

    //get webhook info from discord
    //then get summoners from own server
    await axios
      .get(webhookInputUrl)
      .then((res) => {
        if (res.status === 200) {
          setWebhookUrl(webhookInputUrl);
          setWebhookName(res.data.name);
          axios
            .get(`${process.env.REACT_APP_SERVER_URL}/get`, {
              params: {
                webhook: webhookInputUrl,
              },
            })
            .then((res) => {
              let summonerArr = res.data.summoners.map(
                (summonerNameWithRegion) => {
                  return {
                    name: summonerNameWithRegion.slice(
                      0,
                      summonerNameWithRegion.indexOf("#")
                    ),
                    region: summonerNameWithRegion.slice(
                      summonerNameWithRegion.indexOf("#") + 1
                    ),
                    _id: Math.random(),
                  };
                }
              );

              setSummoners(summonerArr);
              setLoaded(true);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        setWebhookError(true);
      });
    setLoading(false);
  };

  return (
    <form
      className="lg:grid-cols-8 lg:grid flex flex-col"
      onSubmit={handleSearch}
    >
      <div className="lg:col-span-7 flex flex-row drop-shadow-md">
        <input
          type="text"
          className={`w-full text-xl border-none p-2 ${
            webhookError ? "bg-red-100" : ""
          } focus:outline-none focus:bg-gray-200`}
          placeholder="Discord webhook (e.g. https://discord.com/api/webhooks/blahblahblah/blahblahblah"
          value={webhookInputUrl}
          onChange={(e) => setWebhookInputUrl(e.target.value)}
          disabled={loading}
        />
        <a
          href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks#:~:text=%C2%A0%20Facebook-,MAKING%20A%20WEBHOOK,-With%20that%20in"
          target="_blank"
          rel="noreferrer"
          className="border-0 text-xl col-span-1 p-2"
        >
          <HelpIcon className="h-8 w-8 col-span-2" />
        </a>
      </div>
      <button
        className={`bg-blue-500 drop-shadow-md hover:bg-blue-600 text-white text-xl lg:col-span-1 py-2 px-8 justify-self-end ${
          loading ? "bg-gray-300 hover:bg-gray-300" : ""
        }`}
      >
        Find
      </button>
    </form>
  );
};

export default SearchBar;

//Component includes text input for webhook and submit button
