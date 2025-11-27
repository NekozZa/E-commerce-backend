const axios = require('axios')

const COUPON_SERVICE_ROOT = process.env.COUPON_SERVICE_ROOT

const getCoupon = async (couponId) => {
    try {
        const couponResponse = await axios.get(`${COUPON_SERVICE_ROOT}/coupons/${couponId}`)
        const data = couponResponse.data
        return data.coupon
    } 
    catch (err) {
        throw err
    }
}

module.exports = {
    getCoupon
}