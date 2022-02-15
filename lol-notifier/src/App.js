import React from "react";
import "./App.css";
import SubscribePage from "./components/SearchAndDisplay/SubscribePage";
import { WebhookProvider } from "./utils/WebhookContext";

function App() {
  return (
    <div className="App text-4xl text-center mt-20">
      <div className="font-bold logo">League Notifier</div>
      <WebhookProvider>
        <SubscribePage />
      </WebhookProvider>
    </div>
  );
}

export default App;
