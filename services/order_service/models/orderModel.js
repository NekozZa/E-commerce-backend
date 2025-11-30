const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },

    email: {
        type: String,
        required: true
    },

    deliveryAddress: {
        type: String,
        required: true
    },

    purchaseDate: {
        type: Date,
        default: Date.now
    },

    expiredDate: {
        type: Date,
        index: { expires: 0 }
    },

    totalMoney: {
        type: Number,
        required: true
    },

    items: [
        {   
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },

            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
    },

    loyaltyPoint: {
        type: Number
    },

    status: {
        type: String,
        enum: ['Pending', 'Paid', 'On the way', 'Delivered', 'Failed'],
        default: 'Pending'
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order