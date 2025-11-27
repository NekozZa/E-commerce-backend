const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },

    max: {
        type: Number,
        required: true,
        max: [10, "Maximum usage is 10"],
        min: [1, "Minimum usage is 1"]
    },

    usage: {
        type: Number,
        default: 0,
    },

    expiredDate: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },

    discount: {
        type: Number,
        required: true
    },

    minCondition: {
        type: Number,
        required: true
    }
})

const Coupon = mongoose.model('Coupon', couponSchema)

module.exports = Coupon