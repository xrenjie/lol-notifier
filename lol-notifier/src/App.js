import React from "react";
import "./App.css";
import SubscribePage from "./components/SearchAndDisplay/SubscribePage";
import { WebhookProvider } from "./utils/WebhookContext";

function App() {
  return (
    <>
      <div className="App backdrop-blur-sm h-screen">
        <div className="relative text-4xl text-center h-full flex justify-center flex-column">
          <div className="Backdrop relative top-20 py-8 px-60 drop-shadow-lg bg-white w-fit h-fit ">
            <div className="font-bold logo relative">League Notifier</div>
            <WebhookProvider>
              <SubscribePage />
            </WebhookProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
