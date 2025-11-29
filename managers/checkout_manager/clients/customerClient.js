const axios = require('axios')

const CUSTOMER_SERVICE_ROOT = process.env.CUSTOMER_SERVICE_ROOT

const getCustomer = async (authToken, customerId) => {
    try {
        const response = await axios.get(`${CUSTOMER_SERVICE_ROOT}/customers/${customerId}`, { 
            'headers': { 'Authorization': `Bearer ${authToken}` } 
        })

        return response.data.customerDetails
    } 
    catch (err) {
        throw err
    }
}

const updateCustomer = async (authToken, customerId, loyaltyPoint) => {
    try {
        const response = await axios.put(`${CUSTOMER_SERVICE_ROOT}/customers/${customerId}`, 
            { loyaltyPoint },
            { 'headers': { 'Authorization': `Bearer ${authToken}` } }
        )

        return response.data.message
    } 
    catch (err) {
        throw err
    }
}

module.exports = {
    getCustomer,
    updateCustomer
}