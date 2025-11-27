const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String
    },

    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },

    expiredDate: {
        type: Date,
        index: { expires: 0 }
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User