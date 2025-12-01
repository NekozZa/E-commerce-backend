const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Component = require("../models/componentModel");
const Computer = require("../models/computer_Model");
const mongoose = require("mongoose");
exports.updateItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (quantity <= 0)
      return res.status(400).json({ error: "Quantity invalid" });

    item.quantity = quantity;
    await cart.save();

    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// Remove 1 item
exports.removeItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId missing" });
    if (!itemId) return res.status(400).json({ error: "itemId missing" });

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: "Invalid itemId" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    const cart = await Cart.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $pull: { items: { _id: new mongoose.Types.ObjectId(itemId) } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ error: "Cart not found" });
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
      return res.status(200).json(cart);
    }

    // Populate từng product
    const detailedItems = [];

    for (const item of cart.items) {
      let product =
        (await Component.findById(item.productId)) ||
        (await Computer.findById(item.productId)) ||
        (await Product.findById(item.productId));

      if (!product) continue;

      // Tính finalPrice (tự động biết Component / Computer)
      const finalPrice = await calculateFinalPrice(product);

      detailedItems.push({
        itemId: item._id,
        quantity: item.quantity,
        product: product,
        finalPrice: finalPrice,
        totalItemPrice: finalPrice * item.quantity,
      });
    }

    // Tổng tiền toàn giỏ
    const cartTotal = detailedItems.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );

    return res.status(200).json({
      userId: cart.userId,
      items: detailedItems,
      cartTotal,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
async function calculateFinalPrice(product) {
  // Component → dùng giá trực tiếp
  if (product.productType === "Component") {
    return product.price;
  }

  // Computer → tính base price + component prices
  if (product.productType === "Computer") {
    const components = await Product.find({
      _id: { $in: product.components },
    });

    const componentsTotal = components.reduce(
      (sum, c) => sum + (c.price || 0),
      0
    );

    return product.price + componentsTotal;
  }

  // Product bình thường
  return product.price;
}
exports.addItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    const existItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existItem) {
      existItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.getManyItemsTotal = async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemIds } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res
        .status(400)
        .json({ error: "itemIds must be a non-empty array" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    let results = [];
    let grandTotal = 0;

    for (const itemId of itemIds) {
      const item = cart.items.id(itemId);
      if (!item) continue;

      const { productId, quantity } = item;

      // lấy product trực tiếp
      const product = await Product.findById(productId);
      if (!product) continue;

      const price = product.price;
      const total = price * quantity;

      results.push({
        itemId,
        productId,
        name: product.name,
        quantity,
        price,
        total,
      });

      grandTotal += total;
    }

    return res.status(200).json({
      count: results.length,
      items: results,
      grandTotal,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
