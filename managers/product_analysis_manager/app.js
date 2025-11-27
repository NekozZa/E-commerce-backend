require('dotenv').config()
const express = require('express')

const analysisController = require('./controllers/analysisController')

const authMiddleware = require('./middlewares/auth')

const app = express()
const PORT = process.env.PORT | 4000

app.get('/products/analysis', authMiddleware, analysisController.getProductsAnalysis)


app.listen(PORT, () => {
    console.log("Analysis Manager is running")
})