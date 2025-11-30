require('dotenv').config()
const express = require('express')
const logger = require('morgan')

const app = express()
const PORT = process.env.PORT || 4000

const controller = require('./controllers/controller')

const authMiddleware = require('./middlewares/auth')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/checkout', authMiddleware, async function (req, res) {
    const { email, deliveryAddress, items, couponId = undefined, applyLoyaltyPoint, callbackURL } = req.body
    const ipAddress = req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        req.connection.socket.remoteAddress;

    const token = req.token
    const payload = req.payload

    const result = await controller.checkoutOrder(token, payload, ipAddress, callbackURL, email, deliveryAddress, items, couponId, applyLoyaltyPoint)

    if (result.status != 200) { res.status(result.status).json({ data: result.data }) } 
    else { res.status(result.status).json({ paymentURL: result.data} ) }
})

app.get('/vnpay_ipn', async (req, res) => {
    const vnp_Params = req.query
    const result = await controller.processPayment(vnp_Params);

    res.status(200).json({RspCode: result.RspCode, Message: result.Message})
})


app.listen(PORT, () => {
    console.log("Checkout manager is running")
})
