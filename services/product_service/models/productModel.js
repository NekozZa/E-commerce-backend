const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: false },
    inventory: { type: Number, default: 0 },

    images: [{ type: String, required: true }],

    description: String,

    // discriminator key – Mongoose dùng để phân biệt class con
    productType: { type: String, required: true },
  },
  { timestamps: true, discriminatorKey: "productType" }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
