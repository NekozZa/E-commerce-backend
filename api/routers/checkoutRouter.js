const express = require('express')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const errorHandler = require('../utils/errorHandler')

const router = express.Router()
const checkoutManager = axios.create({ baseURL: "http://checkout-manager:4000" })

const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET

const ERROR_MESSAGE = "API: Something went wrong at Checkout Router"

router.post('/', async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        var token = ''
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                token = authHeader.split(' ')[1]
                jwt.verify(token, JWT_LOGIN_SECRET)
            } catch {
                return res.status(401).json({error: "Invalid credentials"})
            }
        } 

        const { deliveryAddress, items, couponId = undefined } = req.body
        const response = await checkoutManager.post(`/checkout`, 
            {  
                deliveryAddress, items, couponId, 
                callbackURL: 'http://localhost:5000/api/checkout/callback' 
            },

            { 'headers': { 'Authorization': `Bearer ${token}` } }
        )

        res
        .status(response.status)
        .json({ paymentURL: response.data.paymentURL })
    }

    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.get('/callback', async (req, res) => {
    res
    .status(200)
    .json({ message: "This is a homepage", queries: req.query })
})

module.exports = router