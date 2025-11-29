const jwt = require('jsonwebtoken')

const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]

    console.log('checkout' + token)

    if (token == '' || token == undefined) { 
        req.token = ''
        next() 
    }
     
    else {
        try {
            const payload = jwt.verify(token, JWT_LOGIN_SECRET)
            req.token = token
            req.payload = payload
            
            next()
        } catch {
            res.status(401).json({error: "Invalid credentials"})
        }
    }
}

module.exports = auth