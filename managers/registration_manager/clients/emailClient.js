const axios = require('axios')

const EMAIL_SERVICE_ENDPOINT = process.env.EMAIL_SERVICE_ENDPOINT

const sendEmail = async (receiver, content) => {
    try {
        await axios.post(`${EMAIL_SERVICE_ENDPOINT}/send-email`, {
            receiver,
            content
        })
    } 
    catch (err) {
        throw err
    }
}

module.exports = {
    sendEmail
}