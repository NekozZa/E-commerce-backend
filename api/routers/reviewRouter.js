const express = require('express');
const axios = require('axios');
const router = express.Router();

const reviewService = axios.create({ baseURL: "http://review-service:3000" });

router.get('/product/:productId', async (req, res) => {
    try {
        const response = await reviewService.get(`/reviews/${req.params.productId}`);
        res.status(response.status).json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Review Service Error" });
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await reviewService.post('/reviews', req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Review Service Error" });
    }
});

module.exports = router;