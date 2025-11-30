require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const app = express()
const PORT = process.env.PORT | 3000

app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

app.post('/send-email', async (req, res) => {
    const { receiver, subject, content } = req.body
    console.log(receiver, content)

    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_SENDER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: `"E-Commerce" <${process.env.EMAIL_SENDER}>`,
            to: receiver,
            subject: subject,
            html: content,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Successful" });
    } catch (error) {
        res.status(500).json({ error: "Failed" });
    }
})

app.listen(PORT, (req, res) => {
    console.log(`http://localhost:${PORT}`)
})