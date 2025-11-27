const express = require('express')
const axios = require('axios')

const errorHandler = require('../utils/errorHandler')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()
const customerService = axios.create({ baseURL: "http://customer-service:3000" })

const ERROR_MESSAGE = "API: Something went wrong at Customer Router"

router.use(authMiddleware)

router.get('/', async (req, res) => {
    try {
        const queries = new URLSearchParams(req.query)
        const response = await customerService.get(`/customers?${queries.toString()}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res
        .status(response.status)
        .json({customers: response.data.customers})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.get('/me', async (req, res) => {
    try {
        const response = await customerService.get('/customers/me', {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res
        .status(response.status)
        .json({customerDetails: response.data.customerDetails})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const response = await customerService.get(`/customers/${req.params.id}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res
        .status(response.status)
        .json({customerDetails: response.data.customerDetails})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.post('/', async (req, res) => {
    try {
        const { fullName, addresses } = req.body
        const response = await customerService.post('/customers', {
            fullName, addresses
        }, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res
        .status(response.status)
        .json({message: response.data.message})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.post('/me/addresses', async (req, res) => {
    try {
        const { addresses } = req.body
        const response = await customerService.post('/customers/me/addresses', { addresses }, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res
        .status(response.status)
        .json({message: response.data.message})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { fullName, addresses } = req.body
        const response = await customerService.put(`/customers/${req.params.id}`, { fullName, addresses }, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res
        .status(response.status)
        .json({message: response.data.message})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const response = await customerService.delete(`/customers/${req.params.id}`, {
            'headers': { 'Authorization': `Bearer ${req.token}` }
        })

        res
        .status(response.status)
        .json({message: response.data.message})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

module.exports = router
