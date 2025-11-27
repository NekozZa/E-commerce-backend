const express = require('express')
const axios = require('axios')

const errorHandler = require('../utils/errorHandler')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()
const orderService = axios.create({ baseURL: "http://order-service:3000" })
const productAnalysisManager = axios.create({ baseURL: "http://product-analysis-manager:4000" })

const ERROR_MESSAGE = "API: Something went wrong at Analysis Router"


router.get('/orders', authMiddleware, async (req, res) => {
    try {
        const { by='year' } = req.query
        const response = await orderService.get(`/orders/analysis?by=${by}`, {
            headers: {
                Authorization: `Bearer ${req.token}`
            }
        })

        res
        .status(response.status)
        .json({groupedOrders: response.data.groupedOrders})
    } 

    catch (err) {
        errorHandler(err, ERROR_MESSAGE)
    }
})

router.get('/products', authMiddleware, async (req, res) => {
    try {
        const { by='year' } = req.query
        const response = await productAnalysisManager.get(`/products/analysis?by=${by}`, {
            headers: {
                Authorization: `Bearer ${req.token}`
            }
        })

        res
        .status(response.status)
        .json({groupedOrders: response.data.groupedOrders})
    } 

    catch (err) {
        errorHandler(err, ERROR_MESSAGE)
    }
})

module.exports = router