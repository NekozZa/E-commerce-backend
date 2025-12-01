const express = require('express')
const axios = require('axios')

const errorHandler = require('../utils/errorHandler')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()
const orderService = axios.create({ baseURL: "http://order-service:3000" })

const ERROR_MESSAGE = "API: Something went wrong at Order Router"

router.use(authMiddleware)


router.get('/analysis/orders', async (req, res) => {
    try {
        const queries = new URLSearchParams(req.query).toString()
        const response = await orderService.get(`/orders/analysis?${queries}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })
        res.status(response.status).json(response.data)
    } catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})


router.get('/analysis/sold-product', async (req, res) => {
    try {
        const queries = new URLSearchParams(req.query).toString()
        const response = await orderService.get(`/orders/analysis/sold-product?${queries}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })
        res.status(response.status).json(response.data)
    } catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})


router.get('/', async (req, res) => {
    try {
        const queries = new URLSearchParams(req.query).toString()
        const response = await orderService.get(`/orders?${queries}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res.status(response.status).json({orders: response.data.orders})
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.get('/me', async (req, res) => {
    try {
        const queries = new URLSearchParams(req.query).toString()
        const response = await orderService.get(`/orders/me?${queries}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res.status(response.status).json({orders: response.data.orders})
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})


router.get('/:id', async (req, res) => {
    try {
        const response = await orderService.get(`/orders/${req.params.id}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res.status(response.status).json({order: response.data.order})
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { newStatus } = req.body
        const response = await orderService.put(`/orders/${req.params.id}`, { 
            newStatus
        }, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res.status(response.status).json({updatedOrder: response.data.updatedOrder})
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const response = await orderService.delete(`/orders/${req.params.id}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res.status(response.status).json({deleteOrder: response.data.deleteOrder})
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

module.exports = router