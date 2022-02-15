import React, { useState, createContext, useContext } from "react";

const WebhookContext = createContext();

export function useWebhookContext() {
  return useContext(WebhookContext);
}

export const WebhookProvider = ({ children }) => {
  const [webhookInputUrl, setWebhookInputUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [summoners, setSummoners] = useState([]);
  const [webhookName, setWebhookName] = useState("");
  const [webhookError, setWebhookError] = useState(false);

  const value = {
    webhookInputUrl,
    setWebhookInputUrl,
    webhookUrl,
    setWebhookUrl,
    summoners,
    setSummoners,
    loading,
    setLoading,
    loaded,
    setLoaded,
    webhookError,
    setWebhookError,
    webhookName,
    setWebhookName,
  };

  return (
    <WebhookContext.Provider value={value}>{children}</WebhookContext.Provider>
  );
};
