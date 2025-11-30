const jwt = require('jsonwebtoken')

const emailClient = require('../clients/emailClient')
const orderClient = require('../clients/orderClient')
const couponClient = require('../clients/couponClient')
const customerClient = require('../clients/customerClient')
const paymentGateway = require('../clients/paymentGateway')
const productClient = require('../clients/productClient')

const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET


const checkoutOrder = async (token, payload, ipAddress, callbackURL, email, deliveryAddress, items, couponId, applyLoyaltyPoint) => {
    try {
        var totalMoney = 0
        var loyaltyPoint = undefined
        
        for (var i = 0; i < items.length; i++) {
            const { productId, quantity } = items[i]
            const product = await productClient.getProduct(productId)

            if (product.inventory < quantity) {
                return {status: 400, data: "Inventory conflict"}
            }
            
            totalMoney += product.price * quantity
        }

        if (couponId) {
            const coupon = await couponClient.getCoupon(couponId)
            totalMoney -= totalMoney * (coupon.discount / 100)
        }

        if (payload && applyLoyaltyPoint) {
            const customer = await customerClient.getCustomer(token)
            const toMoney = customer.loyaltyPoint * 1000
            
            if (toMoney >= totalMoney) {
                totalMoney = 0
                loyaltyPoint = Math.floor((toMoney - totalMoney) / 1000)
            } else {
                totalMoney -= toMoney
                loyaltyPoint = customer.loyaltyPoint
            }
        }
        
        const orderId = await orderClient.createOrder(token, email, deliveryAddress, totalMoney, items, couponId, loyaltyPoint)
        const paymentUrl = await paymentGateway.createPaymentUrl(ipAddress, callbackURL, orderId, totalMoney)
        return { status: 200, data: paymentUrl }
    }
    catch (err) {
        if (err.response) {
            return { status: err.response.status, data: err.response.data }
        }

        return { status: 500, data: "Checkout Manager: Can't communicate with clients" }
    }
}

const processPayment = async (vnp_Params) => {
    const { orderId, rspCode, isIntegral } = paymentGateway.onResult(vnp_Params)
    const authToken = generateAuthToken()

    if (isIntegral) {
        try {
            const order = await orderClient.findOrder(authToken, orderId);
            
            if ((order.totalMoney * 100) != vnp_Params['vnp_Amount']) {
                return {RspCode: '04', Message: 'Amount invalid'}
            } 

            console.log(order)

            if (order.status == "Pending") {
                if (rspCode=="00"){
                    try {
                        for (var i = 0; i < order.items.length; i++) {
                            const { productId, quantity } = order.items[i]
                            const product = await productClient.getProduct(productId)

                            if (product.inventory < quantity) {
                                await emailClient.sendEmail(order.email, `
                                    <h2>Order Paid Failed: Inventory conflict</h2>
                                    <p>Your order id: ${order._id}</p>
                                `)

                                return {RspCode: '00', Message: 'Success'}
                            }
                        }


                        if (order.customerId) {
                            const customer = await customerClient.getCustomerById(authToken, order.customerId)
                            await customerClient.updateCustomer(
                                authToken, order.customerId, 
                                customer.loyaltyPoint - (order.loyaltyPoint ?? 0) + (Math.floor(order.totalMoney * 0.03 / 1000))
                            )
                        }

                        if (order.couponId) {
                            const coupon = await couponClient.getCoupon(order.couponId)
                            await couponClient.updateCoupon(authToken, order.couponId, coupon.usage + 1)
                        }
                        
                        for (var i = 0; i < order.items.length; i++) {
                            const { productId, quantity } = order.items[i]
                            const product = await productClient.getProduct(productId)
                            await productClient.updateProduct(productId, product.inventory - quantity)
                        }

                        console.log("pass product")
                        
                        await orderClient.updateOrder(authToken, orderId, 'Paid')
                        await emailClient.sendEmail(order.email, `
                            <h2>Order Paid Successfully</h2>
                            <p>Your order id: ${order._id}</p>
                        `)
                        
                    }

                    catch (err) {
                        console.log(err)

                        await orderClient.updateOrder(authToken, orderId, 'Failed')
                        await emailClient.sendEmail(order.email, `
                            <h2>Order Paid Failed</h2>
                            <p>Your order id: ${order._id}</p>
                        `)
                    }

                    return {RspCode: '00', Message: 'Success'}
                }
            }
            else{
                await emailClient.sendEmail(order.email, `
                    <h2>Order Paid Failed: Order was already paid</h2>
                    <p>Your order id: ${order._id}</p>
                `)

                return {RspCode: '02', Message: 'This order has been updated to the payment status'}
            }
        }
        catch (err) {
            if (err.response) {
                if (err.response.status == 404) {
                    return {RspCode: '01', Message: 'Order not found'}
                }
            }
        }
    } else {
        return {RspCode: '97', Message: 'Checksum failed'}
    }
}

const generateAuthToken = () => {
    const authToken = jwt.sign({ role: 'admin' }, JWT_LOGIN_SECRET, { expiresIn: '5m' })
    return authToken;
} 

module.exports = {
    checkoutOrder,
    processPayment
}