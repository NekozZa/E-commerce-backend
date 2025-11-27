const axios = require('axios')

const PRODUCT_SERVICE_ROOT = process.env.PRODUCT_SERVICE_ROOT

const getProduct = async (productId) => {
    try {
        const productResponse = await axios.get(`${PRODUCT_SERVICE_ROOT}/products/${productId}`)
        const product = productResponse.data
        return product
    } 
    catch (err) {
        throw err
    }
}

module.exports = {
    getProduct
}