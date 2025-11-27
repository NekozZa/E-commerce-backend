const jwt = require('jsonwebtoken')

const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: "Invalid credentials"})
    }

    try {
        const token = authHeader.split(' ')[1]
        const { id, email, role } = jwt.verify(token, JWT_LOGIN_SECRET)
        
        req.token = token
        next()
    } catch {
        res.status(401).json({error: "Invalid credentials"})
    }
}

module.exports = auth