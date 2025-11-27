const errorHandler = (res, err, message) => {
    if (err.response) {
        const status = err.response.status
        const errMessage = err.response.data.error 
        return res.status(status).json({error: errMessage})
    }

    return res.status(500).json({error: message})
}

module.exports = errorHandler