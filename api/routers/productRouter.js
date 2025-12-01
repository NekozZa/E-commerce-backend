const express = require("express");
const axios = require("axios");

const errorHandler = require("../utils/errorHandler");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
const productService = axios.create({ baseURL: "http://product-service:3000" });

const ERROR_MESSAGE = "API: Something went wrong at Product Router";

router.get("/", async (req, res) => {
  try {
    const queries = new URLSearchParams(req.query).toString();
    const response = await productService.get(`/products?${queries}`);

    res.status(response.status).json({ products: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await productService.get(`/products/${req.params.id}`);

    res.status(response.status).json({ product: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.get("/filter", async (req, res) => {
  try {
    const queries = new URLSearchParams(req.query).toString();
    const response = await productService.get(`/products?${queries}`);

    res.status(response.status).json({ products: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const response = await productService.post(`/products`, req.body);

    res.status(response.status).json({ result: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.post("/:id/variant", async (req, res) => {
  try {
    const response = await productService.post(
      `/products/${req.params.id}/variant`,
      req.body
    );

    res.status(response.status).json({ result: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const response = await productService.patch(
      `/products/${req.params.id}`,
      req.body
    );

    res.status(response.status).json({ result: response.data });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const response = await productService.delete(`/products/${req.params.id}`);

    res.status(response.status).json({ message: response.data.message });
  } catch (err) {
    return errorHandler(res, err, ERROR_MESSAGE);
  }
});
module.exports = router;
