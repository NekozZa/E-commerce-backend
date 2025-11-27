require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')

const Coupon = require('./models/couponModel')

const app = express()
const PORT = process.env.PORT | 3000
const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET

const MONGO_URI = process.env.MONGO_URI

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

const validateInfo = [
    check('max').isInt({ min: 1, max: 10 }).withMessage("Coupon max be between 1 and 10"),
    check('discount').isInt({ min: 1, max: 100 }).withMessage("Discount must be between 1 and 100"),
    check('period').isInt().withMessage("Period is how long the coupon exists computed by number of days"),
    check('minCondition').isInt().withMessage("MinCondition is the lowest total money to apply this coupon")
]

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({error: "Invalid credentials"})
    }

    try {
        const token = authHeader.split(' ')[1]
        const { id, email, role } = jwt.verify(token, JWT_LOGIN_SECRET)
        
        req.user = { id: id, email: email, role: role }
        next()
    } catch {
        res.status(401).json({error: "Invalid credentials"})
    }
}

const castValue = (field, value) => {
    const path = Coupon.schema.path(field)

    switch (path.instance) {
        case "Number":
            return Number(value)
        case "Date":
            return new Date(value)
        default:
            return value
    }
}

app.get('/coupons', async (req, res) => {
    const { orderFields = 'usage:asc', filterFields = undefined, page = 1, limit = 10 } = req.query;
    const sorts = {}
    const filters = {}

    orderFields.split(",").forEach(field => {
        const [fieldName, sortDirection] = field.split(':')
        sorts[fieldName] = sortDirection == 'asc' ? 1 : -1
    });

    if (filterFields) {
        filterFields.split(",").forEach(filter => {
            const [field, op, value] = filter.split(':')
            filters[field] = { [op]: castValue(field, value) }
        })
    }

    console.log(filters)
    
    try {
        const coupons = await Coupon.find(filters)
        .sort(sorts)
        .skip((page - 1) * limit)
        .limit(limit)

        res.status(200).json({coupons: coupons})
    }

    catch (e) {
        res.status(500).json({error: "Can't get coupons"})
    }
})

app.get('/coupons/:id', (req, res) => {
    const { id } = req.params
    
    Coupon.findOne({ _id: id })
    .then(coupon => {
        if (!coupon) { res.status(404).json({ error: "Coupon: Coupon does not exist" }) }
        res.status(200).json({ coupon: coupon })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "Coupon: Can't find coupon" })
    })
})

app.post('/coupons', authMiddleware, validateInfo, async (req, res) => {
    if (req.user.role != 'admin') {
        return res.status(403).json({error: 'Invalid credentials'})
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()[0].msg})
    }

    const dryrun = req.query.dryrun
    const { max, period, discount, minCondition } = req.body

    const generateCoupon = async (length) => {
        while (true) {
            var code = ""

            for (var i = 0; i < length; i++ ){
                code += `${Math.floor(Math.random() * 8 + 1)}`
            }
            
            const coupon = await Coupon.findOne({code})
            if (!coupon) { return code }
        }
    }
    
    const coupon = new Coupon({ 
        max: max,
        discount: discount,
        minCondition: minCondition,
        code: await generateCoupon(6),
        expiredDate: new Date(Date.now() + period * 1000 * 60 * 60 * 24), 
    })

    if (dryrun) { return res.json(coupon) }

    coupon.save()
    .then(() => {
        return res.status(201).json({message: "Succesfully added"})
    })
    .catch((err) => {
        return res.status(500).json({error: err.message})
    })   
})

app.put('/coupons/:id', authMiddleware, validateInfo, async (req, res) => {
    if (req.user.role != 'admin') {
        return res.status(401).json({error: 'Invalid credentials'})
    }

    const couponId = req.params.id
    const { max, expiredDate, discount, minCondition } = req.body

    const coupon = await Coupon.findOne({ _id: couponId })
    const newExpiredDate = expiredDate ? new Date(expiredDate) : coupon.expiredDate

    if (!coupon) { return res.status(404).json({error: "Coupon not found"}) }
    else if (newExpiredDate < coupon.expiredDate) { return res.status(404).json({error: "Invalid expiredDate"}) }

    await Coupon.updateOne({ _id: couponId }, { max, expiredDate: newExpiredDate, discount, minCondition })
    
    res.status(200).json({message: "Successfully updated"})
})

app.delete('/coupons/:id', authMiddleware, async (req, res) => {
    if (req.user.role != 'admin') {
        return res.status(401).json({error: 'Invalid credentials'})
    }

    const couponId = req.params.id
    await Coupon.deleteOne({ _id: couponId })
    
    res.status(200).json({message: "Successfully deleted"})
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})