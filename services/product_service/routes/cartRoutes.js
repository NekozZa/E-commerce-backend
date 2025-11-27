const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartController");

// router.post("/", controller.createCart);
// router.get("/", controller.getCarts);
// router.get("/:id", controller.getCartById);
// router.put("/:id", controller.updateCart);
// router.delete("/:id", controller.deleteCart);
// router.get("/user/:userId", controller.getCartByUserId);
router.get("/:userId", controller.getCart);
router.post("/:userId/items/total", controller.getManyItemsTotal);
router.post("/:userId/addItem", controller.addItem);
router.patch("/:userId/:itemId", controller.updateItem);
router.delete("/:userId/:itemId", controller.removeItem);
router.delete("/:userId", controller.clearCart);

module.exports = router;
