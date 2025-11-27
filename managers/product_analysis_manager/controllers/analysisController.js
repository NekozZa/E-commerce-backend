const orderClient = require('../clients/orderClient')

const getProductsAnalysis = async (req, res) => {
    try {
        const { by='year' } = req.query
        const groupedOrders = await orderClient.getGroupedOrdersByProductId(req.token, by)
        
        res.status(200).json({groupedOrders: groupedOrders})
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