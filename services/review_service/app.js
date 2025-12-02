const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const cors = require('cors');
const reviewController = require('./controllers/reviewController');

require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('Review Client connected:', socket.id);
    
    socket.on('join_product', (productId) => {
        socket.join(`product_${productId}`);
    });
});

// Inject IO vào Request
app.use((req, res, next) => {
    req.io = io;
    next();
});


mongoose.connect(process.env.MONGO_URI || 'mongodb://root:example@mongo:27017/reviews?authSource=admin')
    .then(() => console.log('Review DB connected'));


app.get('/reviews/:productId', reviewController.getReviewsByProduct);
app.post('/reviews', reviewController.addReview);

server.listen(PORT, () => {
    console.log(`Review Service running on port ${PORT}`);
});