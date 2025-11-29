const jwt = require('jsonwebtoken')

const emailClient = require('../clients/emailClient')
const orderClient = require('../clients/orderClient')
const couponClient = require('../clients/couponClient')
const paymentGateway = require('../clients/paymentGateway')
const productClient = require('../clients/productClient')

const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET


const checkoutOrder = async (token, ipAddress, callbackURL, deliveryAddress, items, couponId) => {
    try {
        var totalMoney = 0
        
        for (var i = 0; i < items.length; i++) {
            const { productId, quantity } = items[i]
            const product = await productClient.getProduct(productId)

            console.log(product)

            totalMoney += product.price * quantity
        }

        if (couponId) {
            const coupon = await couponClient.getCoupon(couponId)
            totalMoney -= totalMoney * (coupon.discount / 100)
        }
        
        const orderId = await orderClient.createOrder(token, deliveryAddress, totalMoney, items, couponId)
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
                console.log('04')
                return {RspCode: '04', Message: 'Amount invalid'}
            } 

            if (order.status == "Pending") {
                if (rspCode=="00"){
                    const updatedOrder = await orderClient.updateOrder(authToken, orderId, 'Paid')
                    return {RspCode: '00', Message: 'Success'}
                }
                else {
                    //that bai
                    //paymentStatus = '2'
                    // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                    return {RspCode: '00', Message: 'Success'}
                }
            }
            else{
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