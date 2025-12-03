require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 4000;

const controller = require("./controllers/controller");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/register", async (req, res) => {
  const { email, password, callbackURL } = req.body;
  const result = await controller.register(email, callbackURL, password);
  return res.status(result.status).json({ data: result.data });
});

app.post("/reset", async (req, res) => {
  const { email, callbackURL } = req.body;
  const result = await controller.reset(email, callbackURL);
  return res.status(result.status).json({ data: result.data });
});

app.listen(PORT, () => {
  console.log("Registration Manager is running");
});
