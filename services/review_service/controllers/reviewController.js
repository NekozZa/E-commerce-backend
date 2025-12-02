const Review = require('../models/reviewModel');
const axios = require('axios');


const PRODUCT_SERVICE_URL = 'http://product-service:3000'; 


const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const addReview = async (req, res) => {
    const { productId, customerId, customerName, rating, comment } = req.body;

    try {
        // B1
        const newReview = await Review.create({
            productId, customerId, customerName, rating, comment
        });

        // B2
        const stats = await Review.aggregate([
            { $match: { productId: productId } },
            { 
                $group: { 
                    _id: '$productId', 
                    avgRating: { $avg: '$rating' }, 
                    totalReviews: { $sum: 1 } 
                } 
            }
        ]);

        const avgRating = stats[0]?.avgRating || 0;
        const totalReviews = stats[0]?.totalReviews || 0;

        // B3
        try {
            await axios.patch(`${PRODUCT_SERVICE_URL}/api/products/${productId}/internal/rating`, {
                rating: avgRating,
                numReviews: totalReviews
            });
        } catch (syncErr) {
            console.error("Sync to Product Service failed:", syncErr.message);
            
        }

        // B4
        if (req.io) {
            req.io.to(`product_${productId}`).emit('new_review', {
                newReview,
                newRating: avgRating,
                numReviews: totalReviews
            });
        }

        res.status(201).json({ message: 'Review added', review: newReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getReviewsByProduct, addReview };