const axios = require('axios')

const AUTH_SERVICE_ENDPOINT = process.env.AUTH_SERVICE_ENDPOINT

const getPassword = async (email) => {
    try {
        const authResponse = await axios.post(`${AUTH_SERVICE_ENDPOINT}/register`, { email })
        const data = await authResponse.data
        return data.password
    }
    catch (err) {
        throw err
    }
}

const getResetPasswordToken = async (email) => {
    try {
        const authResponse = await axios.post(`${AUTH_SERVICE_ENDPOINT}/reset`, { email })
        return authResponse.data.token
    }
    catch (err) {
        throw err
    }
}

module.exports = {
    getPassword,
    getResetPasswordToken
}