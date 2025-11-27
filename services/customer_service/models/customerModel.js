const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: 'customer'
    },

    addresses: {
        type: [String],
        default: []
    },

    loyaltyPoint: {
        type: Number,
        default: 0
    },
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer