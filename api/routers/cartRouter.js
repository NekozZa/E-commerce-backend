const express = require("express");
const axios = require("axios");

const errorHandler = require("../utils/errorHandler");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
const cartService = axios.create({ baseURL: "http://product-service:3000" });

const ERROR_MESSAGE = "API: Something went wrong at Cart Router";

router.get("/:userId", async (req, res) => {
  try {
    const response = await cartService.get(`/carts/${req.params.userId}`);

    res.status(response.status).json({ cart: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.post("/:userId/items/total", async (req, res) => {
  try {
    const response = await cartService.post(
      `/carts/${req.params.userId}/items/total`,
      req.body
    );

    res.status(response.status).json({ result: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.post("/:userId/addItem", async (req, res) => {
  try {
    const response = await cartService.post(
      `/carts/${req.params.userId}/addItem`,
      req.body
    );

    res.status(response.status).json({ result: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});
router.patch("/:userId/:itemId", async (req, res) => {
  try {
    // const { userId, itemId } = req.query
    const { userId, itemId } = req.params;

    
    const response = await cartService.patch(
      `/carts/${userId}/${itemId}`,
      req.body
    );

    res.status(response.status).json({ cart: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.delete("/:userId/:itemId", async (req, res) => {
  try {
    //  const { userId, itemId } = req.query

    const { userId, itemId } = req.params;

    const response = await cartService.delete(`/carts/${userId}/${itemId}`);

    res.status(response.status).json({ cart: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});


router.delete("/:userId", async (req, res) => {
  try {
    //  const { userId } = req.query

    const { userId } = req.params;

    const response = await cartService.delete(`/carts/${userId}`);

    res.status(response.status).json({ cart: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

module.exports = router;
