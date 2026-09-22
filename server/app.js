const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();

app.get("/", (req, res) => res.send("Messaging app is running"));

app.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "Felicia",
  };
  jwt.sign({ user }, "secretkey", { expiresIn: "30m" }, (err, token) => {
    if (err) {
      return res.sendStatus(500);
    }

    res.json({ token });
  });
});

app.post("/newMessage", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Message sent",
        authData,
      });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log("Eroare");
  }
  console.log(`App runnianag on port =${process.env.PORT}`);
});
