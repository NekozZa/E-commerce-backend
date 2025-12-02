const express = require('express')
const axios = require('axios')
const errorHandler = require('../utils/errorHandler')

const router = express.Router()

const authService = axios.create({ baseURL: "http://auth-service:3000" })

const ERROR_MESSAGE = "API: Something went wrong Auth Router"

// --- LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const request = await authService.post('/login', {
            email,
            password
        })
        const data = await request.data;
        res.status(200).json({token: data.token})
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

// --- REGISTER (ĐÃ SỬA) 
router.post('/register', async (req, res) => {
    try {
        // 1. Nhận đủ thông tin từ Frontend
        const { email, password, fullName } = req.body
        
        // 2. Gọi sang Auth Service (Gửi kèm password và fullName)
        // Backend sẽ tự check: nếu có password thì dùng, không có thì tự sinh
        const response = await authService.post('/register', {
            email, 
            password, 
            fullName,
            // callbackURL vẫn giữ nếu bạn cần gửi mail xác thực
            callbackURL: `http://localhost:5000/api/auth/register/callback?email=${email}`
        })

        res.status(response.status).json(response.data)
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})


router.get('/register/callback', async (req, res) => {
    try {
        const { email } = req.query
        const response = await authService.get(`/register/callback?email=${email}`)
        res.status(response.status).json({message: response.data.message })
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.post('/reset', async (req, res) => {
    try {
        const { email } = req.body
        // Gọi authService luôn cho đồng bộ
        const response = await authService.post('/reset', { 
            email, callbackURL: `http://localhost:5000/api/auth/reset/callback`
        })
        res.status(200).json(response.data)
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

router.get('/reset/callback', (req, res) => {
    res.status(200).json({ token: req.query.token })
})

router.put('/reset', async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader.split(' ')[1]
        const { password } = req.body

        const response = await authService.put('/reset', { password }, {
            'headers': { Authorization: `Bearer ${token}` }
        })
        res.status(200).json(response.data)
    }
    catch (err) {
        return errorHandler(res, err, ERROR_MESSAGE)
    }
})

module.exports = router