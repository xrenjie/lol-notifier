const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const childProcess = require("child_process");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const discordRouter = require("./routes/discord");

app.use("/api/discord", discordRouter);

//start fetch process
childProcess.fork("./functions/fetchSummonerStatus.js");

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
