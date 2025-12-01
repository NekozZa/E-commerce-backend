const orderClient = require('../clients/orderClient')
const productClient = require('../clients/productClient')

const getProductsAnalysis = async (req, res) => {
    try {
        const { by='product', sort='totalSale', limit } = req.query
        const groupedOrdersByProduct = await orderClient.getGroupedOrdersByProductId(req.token, by)

        for (var i = 0; i < groupedOrdersByProduct.length; i++) {
            const productId = groupedOrdersByProduct[i]._id.productId
            const product = await productClient.getProduct(productId)
            
            var totalSale = 0
            var totalQuantity = 0

            const ordersOfProduct = groupedOrdersByProduct[i].orders
            for (var j = 0; j < ordersOfProduct.length; j++) {
                const order = ordersOfProduct[j]

                totalQuantity += order.items.quantity
                totalSale += order.items.quantity * product.price
            }

            delete groupedOrdersByProduct[i].orders
            groupedOrdersByProduct[i].totalSale = totalSale
            groupedOrdersByProduct[i].totalQuantity = totalQuantity
        }

        if (by == 'product') {
            if (sort == 'totalSale') { groupedOrdersByProduct.sort((a, b) => a.totalSale - b.totalSale) }
            else if (sort == 'totalQuantity') { groupedOrdersByProduct.sort((a, b) => a.totalQuantity - b.totalQuantity) }
        }

        if (limit) { groupedOrdersByProduct.slice(0, limit + 1) }
        
        res.status(200).json({productAnalysis: groupedOrdersByProduct})
    }
    
    catch (err) {
        if (err.response) {
            const status = err.response.status
            const errMessage = err.response.data.error
            return res.status(status).json({error: errMessage})
        }

        res.status(500).json({error: "Product Analysis Manager: Something went wrong"})
    }
}

module.exports = {
    getProductsAnalysis
}