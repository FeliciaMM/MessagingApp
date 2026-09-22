const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const prisma = require("../lib/prisma");
require("dotenv").config();
app.use(express.json());

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

///const users = await prisma.users.findMany();
///const user = await prisma.users.create({
//   data: {
//     username: "Felicia",
//     password: "password123",
//   },
// });

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.users.create({
      data: { username, password },
    });

    res.status(201).json({
      id: user.id.toString(),
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not register user" });
  }
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
