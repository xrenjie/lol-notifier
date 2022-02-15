import React from "react";
import { useWebhookContext } from "../../utils/WebhookContext";
import { ReactComponent as BackIcon } from "../../assets/left-arrow.svg";

const WebhookInfoDisplay = () => {
  const { webhookName, webhookUrl, setWebhookName, setWebhookUrl, setLoaded } =
    useWebhookContext();

  const handleBack = (e) => {
    setWebhookName("");
    setWebhookUrl("");
    setLoaded(false);
  };

  return (
    <div className="flex flex-row shadow-lg">
      <button className=" p-4 w-12" onClick={handleBack}>
        <BackIcon className="h-8 w-8" />
      </button>
      <div className="flex flex-col p-4 w-full">
        <h1>{webhookName}</h1>
        <p className="text-xs container hidden lg:[display:block]">
          {webhookUrl}
        </p>
      </div>
    </div>
  );
};

export default WebhookInfoDisplay;

//Shows webhook info (url, webhook name) and button to apply changes at top
