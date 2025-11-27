const axios = require('axios')

const orderService = axios.create({ baseURL: process.env.ORDER_SERVICE_ROOT })

const getGroupedOrdersByProductId = async (token, by) => {
    try {
        const response = await orderService.get(`/orders/analysis/sold-product?by=${by}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        
        return response.data.groupedOrders
    }

    catch (err) {
        throw err
    }
}

module.exports = {
    getGroupedOrdersByProductId
}


