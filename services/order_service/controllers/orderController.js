const jwt = require('jsonwebtoken')

const data = require('../mock_data/data.json')

const Order = require('../models/orderModel')

const EXPIRY = 15
const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET

const getAllOrders = async (req, res) => {
    if (req.user.role !== 'admin') { return res.status(401).json({error: 'Unauthorized'}) }

    const { orderFields = 'purchaseDate:dsc', filterFields = undefined, page = 1, limit = 10 } = req.query;
    const orders = await getOrders(orderFields, filterFields, page, limit)
    res.status(200).json({orders: orders}) 
}

const getMyOrders = async (req, res) => {
    var { orderFields = 'purchaseDate:dsc', filterFields = undefined, page = 1, limit = 10 } = req.query;
    
    if (filterFields) { filterFields += `,customerId:$eq:${req.user.id}` }
    else { filterFields = `customerId:$eq:${req.user.id}` }

    const orders = await getOrders(orderFields, filterFields, page, limit)
    res.status(200).json({orders: orders})    
}

const getOrder = async (req, res) => {
    const { id } = req.params
    
    Order.findOne({ _id: id })
    .then(order => {
        if (!order) {
            return res.status(404).json({error: "Order: Order id doest not exist"})
        }

        if (req.user.role == 'customer' && req.user.id != order.customerId) {
            return res.status(403).json({error: "Order: This is not your order"})
        }

        res.status(200).json({order: order})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "Order: Can't find order"})
    })    
}

const addOrders = async () => {
    data.forEach(order => {
        Order.create(order)
    })  
}

const addOrder = (req, res) => {
    const { email, deliveryAddress, totalMoney, items, couponId, loyaltyPoint = undefined } = req.body
    const expiredDate = new Date(Date.now() + EXPIRY * 60 * 1000)
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]

    var order = { email, deliveryAddress, expiredDate, totalMoney, items, couponId, loyaltyPoint }

    if (token) {
        try {
            const { id, email, role } = jwt.verify(token, JWT_LOGIN_SECRET)
            order.customerId = id
        } 
        catch {
            return res.status(401).json({error: "Invalid credentials"})
        }
    }

    if (items.length <= 0) { return res.status(400).json({error: "Order: Empty items"}) } 

    Order.create(order)
    .then(data => {
        console.log(data)
        res.status(201).json({orderId: data._id})    
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "Order: Can't add new order"})
    })
}

const updateOrder = async (req, res) => {
    const { id } = req.params
    const { newStatus } = req.body

    if (req.user.role == 'customer') {
        return res.status(403).json({error: "Order: You are not allowed to this"})
    }

    Order.findOne({ _id: id })
    .then(order => {
        if (!order) {
            return res.status(404).json({error: "Order: Can't find order"})
        }

        if (checkStatus(order.status, newStatus) <= 0) {
            return res.status(400).json({error: "Order: Invalid status"})
        }
        
        Order.findByIdAndUpdate(id, { status: newStatus, $unset: { expiredDate: "" } }, {
            new: true,
            runValidators: true
        })
        .then(updatedOrder => {
            if (!updatedOrder) {
                return res.status(404).json({error: "Order: Can't find order"})
            }

            res.status(200).json({updatedOrder: updatedOrder})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "Order: Can't update order"})
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "Order: Can't find order during update"})
    })
}

const deleteOrder = (req, res) => {
    const { id } = req.params

    Order.findByIdAndDelete({ _id: id })
    .then(deletedOrder => {
        if (!deletedOrder) {
            return res.status(404).json({error: "Order: Can't find order"})
        }

        res.status(200).json({deletedOrder: deletedOrder})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "Order: Can't delete order"})
    })
}

const checkStatus = (oldStatus, newStatus) => {
    const statusQueue = ['Pending', 'Paid', 'On the way', 'Delivered', 'Failed']
    return statusQueue.indexOf(newStatus) - statusQueue.indexOf(oldStatus)
}

const getOrders = async (orderFields, filterFields, page, limit) => {
    const filters = {}
    const sorts = {}

    orderFields.split(',').forEach(field => {
        const [fieldName, sortDirection] = field.split(':')
        sorts[fieldName] = sortDirection == 'asc' ? 1 : -1
    });

    if (filterFields) {
        filterFields.split(",").forEach(filter => {
            var [field, op, value] = filter.split(':')
            filters[field] = { [op]: castValue(field, value) }
        })
    }
    
    const orders = await Order.find(filters)
        .sort(sorts)
        .skip((page - 1) * limit)
        .limit(limit)

    return orders
}

const castValue = (field, value) => {
    const path = Order.schema.path(field)

    switch (path.instance) {
        case "Number":
            return Number(value)
        case "Date":
            return new Date(value)
        default:
            return value
    }
}

module.exports = {
    getAllOrders,
    getMyOrders,
    getOrder,
    addOrder,
    addOrders,
    updateOrder,
    deleteOrder
}

