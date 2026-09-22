const express = require("express");
const app = express();
require("dotenv").config();

app.get("/", (req, res) => res.send("Messaging app is running"));

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log("Eroare");
  }
  console.log(`App runnianag on port =${process.env.PORT}`);
});
