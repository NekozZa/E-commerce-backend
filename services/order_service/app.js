require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const orderController = require('./controllers/orderController')
const analysisController = require('./controllers/analysisController')

const authMiddleware = require('./middleware/auth')

const app = express()
const PORT = process.env.PORT | 3000
const MONGO_URI = process.env.MONGO_URI

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/orders/analysis', authMiddleware, analysisController.getOrdersAnalysisByTime)
app.get('/orders/analysis/sold-product', authMiddleware, analysisController.getSoldProductsByTime)

app.get('/orders', authMiddleware, orderController.getAllOrders)
app.get('/orders/me', authMiddleware, orderController.getMyOrders)
app.get('/orders/:id', authMiddleware, orderController.getOrder)

app.post('/orders', orderController.addOrder)
app.put('/orders/:id', authMiddleware, orderController.updateOrder)
app.delete('/orders/:id', authMiddleware, orderController.deleteOrder)

app.listen(PORT)
