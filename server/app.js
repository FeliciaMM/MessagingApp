const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const prisma = require("../lib/prisma");
require("dotenv").config();
app.use(express.json());

app.get("/", (req, res) => res.send("Messaging app is running"));

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await prisma.users.findFirst({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user: { id: user.id.toString(), username: user.username } },
      process.env.SECRET_FOR_AUTH,
    );

    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
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

app.post("/newMessage", verifyToken, async (req, res) => {
  const body = { username, text };
  const newMessage = await prisma.messages.create({
    username,
    text,
  });
  jwt.verify(req.token, process.env.SECRET_FOR_AUTH, (err, authData) => {
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
  console.log(`App runnianag on port = ${process.env.PORT}`);
});
