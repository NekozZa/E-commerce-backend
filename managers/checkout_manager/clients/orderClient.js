const axios = require('axios')

const ORDER_SERVICE_ROOT = process.env.ORDER_SERVICE_ROOT

const createOrder = async (token, deliveryAddress, totalMoney, items, couponId, loyaltyPoint) => {
    try {
        const orderResponse = await axios.post(`${ORDER_SERVICE_ROOT}/orders`, 
            {
                deliveryAddress: deliveryAddress, totalMoney: totalMoney,
                items: items, couponId: couponId, loyaltyPoint: loyaltyPoint
            },

            { 'headers': { 'Authorization': `Bearer ${token}` } }
        )

        const data = orderResponse.data
        return data.orderId
    } 
    catch (err) {
        throw err
    }
}

const findOrder = async (authToken, orderId) => {
    try {
        const orderResponse = await axios.get(`${ORDER_SERVICE_ROOT}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })

        const data = await orderResponse.data
        return data.order
    } 
    catch (err) {
        throw err
    }
}

const updateOrder = async (authToken, orderId, status) => {
    try {
        const orderResponse = await axios.put(`${ORDER_SERVICE_ROOT}/orders/${orderId}`, {
            newStatus: status
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })

        const data = orderResponse.data
        return data.updatedOrder
    }
    catch (err) {
        throw err
    }
}

module.exports = {
    createOrder,
    findOrder,
    updateOrder
}