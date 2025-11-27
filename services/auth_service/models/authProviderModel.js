const mongoose = require('mongoose')

const authProviderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true 
    },

    providerName: {
        type: String,
        required: true
    },

    providerUserId: {
        type: String,
        required: true
    }
})

const AuthProvider = mongoose.model('AuthProvider', authProviderSchema)

module.exports = AuthProvider