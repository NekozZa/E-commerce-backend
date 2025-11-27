const Order = require('../models/orderModel')

const getOrdersAnalysisByTime = async (req, res) => {
    if (req.user.role != 'admin') { return res.status(403).json({error: "Forbidden actions"}) }

    const { by='year' } = req.query
    var groupBy = {}
    var sort = {}

    var startDate = undefined
    var endDate = undefined

    if (by.startsWith('custom:')) {
        const [tag, start, end] = by.split(":")
        const [sy, sm, sd] = start.split('-').map(Number)
        const [ey, em, ed] = end.split('-').map(Number)

        startDate = new Date(sy, sm - 1, sd, 0, 0, 0)
        endDate = new Date(ey, em - 1, ed, 23, 59, 59, 999)

        groupBy = {
            year: { $year: '$purchaseDate' },
            month: { $month: '$purchaseDate' },
            day: { $dayOfMonth: '$purchaseDate' }
        }

        sort = { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    } else {
        switch (by) {
            case 'year':
                groupBy = { year: { $year: '$purchaseDate' } }
                sort = { '_id.year': 1 }
                break
            case 'quarter':
                groupBy = { 
                    year: { $year: '$purchaseDate' },
                    quarter: { $ceil: { $divide: [{ $month: '$purchaseDate' }, 3] } }
                }

                sort = { '_id.year': 1, '_id.quarter': 1 }
                break
            case 'month':
                groupBy = { 
                    year: { $year: '$purchaseDate' },
                    month: { $month: '$purchaseDate' }
                }

                sort = { '_id.year': 1, '_id.month': 1 }
                break
            case 'week':
                groupBy = {
                    year: { $year: '$purchaseDate' },
                    week: { $week: '$purchaseDate' }
                }

                sort = { '_id.year': 1, '_id.week': 1 }
                break
        }
    }

    const match = {
        status: { $ne: 'Pending' }
    }

    if (startDate && endDate) {
        match.purchaseDate = { $gte: startDate, $lte: endDate }
    }

    const orders = await Order.aggregate([
        {   $match: match },
        {   $unwind: '$items' },
        {
            $group: {
                _id: groupBy,
                totalRevenue: { $sum: '$totalMoney' },
                numberOfProducts: { $sum: '$items.quantity' },
                numberOfOrders: { $sum: 1 }
            }
        },
        { $sort: sort }
    ])

    res.status(200).json({groupedOrders: orders})
}

const getSoldProductsByTime = async (req, res) => {
    if (req.user.role != 'admin') { return res.status(403).json({error: "Forbidden actions"}) }

    const { by='year' } = req.query
    var groupBy = {}
    var sort = {}

    var startDate = undefined
    var endDate = undefined

    if (by.startsWith('custom:')) {
        const [tag, start, end] = by.split(":")
        const [sy, sm, sd] = start.split('-').map(Number)
        const [ey, em, ed] = end.split('-').map(Number)

        startDate = new Date(sy, sm - 1, sd, 0, 0, 0)
        endDate = new Date(ey, em - 1, ed, 23, 59, 59, 999)

        groupBy = {
            productId: "$items.productId", 
            year: { $year: '$purchaseDate' },
            month: { $month: '$purchaseDate' },
            day: { $dayOfMonth: '$purchaseDate' }
        }

        sort = { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    } else {
        switch (by) {
            case 'year':
                groupBy = { 
                    productId: "$items.productId",
                    year: { $year: '$purchaseDate' } 
                }
                
                sort = { '_id.year': 1 }
                break
            case 'quarter':
                groupBy = { 
                    productId: "$items.productId",
                    year: { $year: '$purchaseDate' },
                    quarter: { $ceil: { $divide: [{ $month: '$purchaseDate' }, 3] } }
                }

                sort = { '_id.year': 1, '_id.quarter': 1 }
                break
            case 'month':
                groupBy = { 
                    productId: "$items.productId",
                    year: { $year: '$purchaseDate' },
                    month: { $month: '$purchaseDate' }
                }

                sort = { '_id.year': 1, '_id.month': 1 }
                break
            case 'week':
                groupBy = {
                    productId: "$items.productId",
                    year: { $year: '$purchaseDate' },
                    week: { $week: '$purchaseDate' }
                }

                sort = { '_id.year': 1, '_id.week': 1 }
                break
        }
    }

    const match = {
        status: { $ne: 'Pending' }
    }

    if (startDate && endDate) {
        match.purchaseDate = { $gte: startDate, $lte: endDate }
    }

    const groupedOrders = await Order.aggregate([
        {   $match: match },
        {   $unwind: '$items' },
        {
            $group: {
                _id: groupBy,
                orders: { $push: "$$ROOT" }
            }
        },
        { $sort: sort }
    ])

    res.status(200).json({groupedOrders: groupedOrders})
}

module.exports = {
    getOrdersAnalysisByTime,
    getSoldProductsByTime
}