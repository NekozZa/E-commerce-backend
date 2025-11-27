const express = require('express')
const axios = require('axios')

const errorHandler = require('../utils/errorHandler')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()
const couponService = axios.create({ baseURL: "http://coupon-service:3000" })

const ERROR_MESSAGE = "API: Something went wrong at Coupon Router"

router.get('/', async (req, res) => {
    try {
        const queries = new URLSearchParams(req.query)
        const response= await couponService.get(`/coupons?${queries.toString()}`)
        const data = response.data

        res.status(200).json({coupons: data.coupons})
    }
    
    catch (err) {
        return errorHandler(err, ERROR_MESSAGE)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const response = await couponService.get(`/coupons/${req.params.id}`)
        const data = response.data

        res.status(200).json({coupon: data.coupon})
    }

    catch (err) {
       return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { max, period, discount, minCondition } = req.body
        const response = await couponService.post('/coupons', {
            max, period, discount, minCondition
        }, {
            "headers": {
                'Authorization': `Bearer ${req.token}`
            }
        })

        res.status(response.status).json({message: response.data.message})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { max, expiredDate, discount, minCondition } = req.body
        const response = await couponService.put(`/coupons/${req.params.id}`, 
            { max, expiredDate, discount, minCondition }, 
            {"headers": {'Authorization': `Bearer ${req.token}`}
        })

        res.status(response.status).json({message: response.data.message})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const response = await couponService.delete(`/coupons/${req.params.id}`, {
            "headers": { 'Authorization': `Bearer ${req.token}` }
        })

        res.status(response.status).json({message: response.data.message})
    }
    
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

module.exports = router
