const Product = require("./productModel");
const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  componentType: {
    type: String,
    required: true,
    enum: [
      "cpu",
      "ram",
      "mainboard",
      "psu",
      "case",
      "cooler",
      "ssd",
      "vga",
      "hdd",
    ],
  },

  specs: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const Component = Product.discriminator("Component", componentSchema);
module.exports = Component;
