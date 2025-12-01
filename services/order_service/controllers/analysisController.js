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
        status: { $nin: ['Pending', 'Failed'] }
    }

    if (startDate && endDate) {
        match.purchaseDate = { $gte: startDate, $lte: endDate }
    }

    const orders = await Order.aggregate([
        {   $match: match },

        // --- BƯỚC 1: LỌC TRÙNG (De-duplication) ---
        // Gom nhóm các đơn hàng giống hệt nhau lại thành 1
        {
            $group: {
                _id: { 
                    customerId: "$customerId", 
                    purchaseDate: "$purchaseDate",
                    totalMoney: "$totalMoney"
                },
                uniqueDoc: { $first: "$$ROOT" } // Lấy 1 bản ghi đại diện
            }
        },
        // --- BƯỚC 2: KHÔI PHỤC CẤU TRÚC ---
        // Đưa bản ghi đại diện trở lại làm root document để tính toán tiếp
        {
            $replaceRoot: { newRoot: "$uniqueDoc" }
        },

        // --- BƯỚC 3: TÍNH TOÁN THỐNG KÊ (Như bình thường) ---
        {
            $group: {
                _id: groupBy,
                totalRevenue: { $sum: '$totalMoney' },
                // Tính tổng quantity trong mảng items (không cần unwind)
                numberOfProducts: { $sum: { $sum: "$items.quantity" } },
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
            case 'product':
                groupBy = { 
                    productId: "$items.productId"
                }
                
                sort = { '_id': 1 }
                break
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
        status: { $nin: ['Pending', 'Failed'] }
    }

    if (startDate && endDate) {
        match.purchaseDate = { $gte: startDate, $lte: endDate }
    }

    const groupedOrders = await Order.aggregate([
        {   $match: match },
        
        // --- ÁP DỤNG LỌC TRÙNG CHO CẢ HÀM NÀY ---
        {
            $group: {
                _id: { 
                    customerId: "$customerId", 
                    purchaseDate: "$purchaseDate",
                    totalMoney: "$totalMoney"
                },
                uniqueDoc: { $first: "$$ROOT" }
            }
        },
        {
            $replaceRoot: { newRoot: "$uniqueDoc" }
        },
        // -----------------------------------------

        {   $unwind: '$items' }, // Unwind để tách sản phẩm
        {
            $group: {
                _id: groupBy,
                orders: { $push: "$$ROOT" },
                // Thêm trường tổng số lượng bán để frontend dễ sắp xếp
                totalSold: { $sum: "$items.quantity" } 
            }
        },
        { $sort: sort }
    ])

    res.status(200).json({groupedOrders: groupedOrders})
}

// Giữ nguyên hàm này nếu bạn dùng
const getCustomerStats = async (req, res) => {
    if (req.user.role != 'admin') { return res.status(403).json({error: "Forbidden actions"}) }
    try {
        const stats = await Order.aggregate([
            { $match: { status: { $nin: ['Failed', 'Cancelled'] } } },
            // Lọc trùng cho customer stats luôn cho chắc
            {
                $group: {
                    _id: { customerId: "$customerId", purchaseDate: "$purchaseDate", totalMoney: "$totalMoney" },
                    uniqueDoc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$uniqueDoc" } },
            // Tính toán
            {
                $group: {
                    _id: "$customerId",
                    totalSpent: { $sum: "$totalMoney" },
                    ordersCount: { $sum: 1 },
                    lastActive: { $max: "$purchaseDate" }
                }
            }
        ]);
        const statsMap = {};
        stats.forEach(item => {
            if(item._id) {
                statsMap[item._id.toString()] = {
                    totalSpent: item.totalSpent,
                    orders: item.ordersCount,
                    lastActive: item.lastActive
                };
            }
        });
        res.status(200).json({ customerStats: statsMap });
    } catch (error) {
        res.status(500).json({ error: "Failed to aggregate customer stats" });
    }
}

module.exports = {
    getOrdersAnalysisByTime,
    getSoldProductsByTime,
    getCustomerStats
}