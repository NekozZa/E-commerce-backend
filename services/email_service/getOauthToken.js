require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");

const app = express();
const port = 5000;

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ["https://mail.google.com/"];

app.get("/", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.send(`<a href="${authUrl}">Login with Google to get Refresh Token</a>`);
});

app.get("/get-oauth-token", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code found from Google!");

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    res.send(`
      <h3>Token retrieved successfully!</h3>
      <p><b>Access Token:</b> ${tokens.access_token}</p>
      <p><b>Refresh Token:</b> ${tokens.refresh_token}</p>
      <br/>Copy the Refresh Token and paste it into your .env file.
    `);
    console.log("Refresh Token:", tokens.refresh_token);
  } catch (err) {
    res.send("Error while getting token!");
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});