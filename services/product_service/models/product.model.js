const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true, validate: (v) => v.length >= 3 }],
  brand: { type: String, required: true },
  variants: [{ type: String, required: true, validate: (v) => v.length >= 2 }],
  description: { type: String, required: true, minlength: 50 },
  inventory: { type: Number, default: 0 },
  type: {
    type: String,
    require: true,
    enum: ["computer", "component"],
  },
});
module.exports = mongoose.model("Product", productSchema);
