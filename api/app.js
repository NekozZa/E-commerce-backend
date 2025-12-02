require('dotenv').config()
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

const authRouter = require('./routers/authRouter')
const orderRouter = require('./routers/orderRouter')
const couponRouter = require('./routers/couponRouter')
const customerRouter = require('./routers/customerRouter')
const checkoutRouter = require('./routers/checkoutRouter')
const analysisRouter = require('./routers/analysisRouter')
const productRouter = require('./routers/productRouter')
const cartRouter = require('./routers/cartRouter')
const reviewRouter = require('./routers/reviewRouter')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true 
}));

app.use('/api/auth/oauth/google', 
    createProxyMiddleware({
        target: 'http://auth-service:3000',
        changeOrigin: true,
        pathRewrite: { '^/': '/oauth/google' }
    })
)

app.use('/api/auth', authRouter)
app.use('/api/orders', orderRouter)
app.use('/api/coupons', couponRouter)
app.use('/api/customers', customerRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/analysis', analysisRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/reviews', reviewRouter)

app.listen(PORT, () => {
    console.log(`API Gateway is running on port: ${PORT}`)
})