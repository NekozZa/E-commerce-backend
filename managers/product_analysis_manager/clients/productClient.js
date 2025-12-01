const axios = require('axios')

const productService = axios.create({ baseURL: process.env.PRODUCT_SERVICE_ROOT })

const getProduct = async (productId) => {
    try {
        const productResponse = await productService.get(`/products/${productId}`)
        const product = productResponse.data.product
        return product
    } 
    catch (err) {
        throw err
    }
}

module.exports = {
    getProduct
}