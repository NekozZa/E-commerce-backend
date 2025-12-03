const express = require("express");
const axios = require("axios");
const errorHandler = require("../utils/errorHandler");

const router = express.Router();

const authService = axios.create({ baseURL: "http://auth-service:3000" });

const ERROR_MESSAGE = "API: Something went wrong Auth Router";

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const request = await authService.post("/login", {
      email,
      password,
    });
    const data = await request.data;
    res.status(200).json({ token: data.token });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const response = await authService.post("/register", {
      email,
      fullName,
      callbackURL: `http://localhost:5000/api/auth/register/callback?email=${email}`,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.get("/register/callback", async (req, res) => {
  try {
    const { email } = req.query;
    const response = await authService.get(`/register/callback?email=${email}`);
    res.status(response.status).json({ message: response.data.message });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.post("/reset", async (req, res) => {
  try {
    const { email } = req.body;
    const response = await authService.post("/reset", {
      email,
      callbackURL: `http://localhost:5000/api/auth/reset/callback`,
    });
    res.status(200).json(response.data);
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.get("/reset/callback", (req, res) => {
  res.status(200).json({ token: req.query.token });
});

router.put("/reset", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const { password } = req.body;

    const response = await authService.put(
      "/reset",
      { password },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.status(200).json(response.data);
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.get("/oauth/google", async (req, res) => {
  try {
    // Redirect to auth service OAuth endpoint
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || "http://localhost:3000";
    res.redirect(`${authServiceUrl}/oauth/google`);
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.get("/oauth/google/callback", async (req, res) => {
  try {
    const response = await authService.get("/oauth/google/callback", {
      params: req.query,
    });

    // Redirect to frontend with token
    const token = response.data.token;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}?token=${token}&provider=google`);
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

module.exports = router;
