const express = require("express");
const router = express.Router();
// const Controller = require("../controllers/productController");

const oke = require("../controllers/haiConHeo");


router.get("/filter", oke.getProduct);
router.get("/:id", oke.getProductById);
router.get("/", oke.getProduct);

router.post("/:id/variant", oke.getVariantByChanged);
router.post("/", oke.createProduct1);

router.patch("/:id", oke.updateProduct);
router.delete("/:id", oke.deleteProduct);
module.exports = router;
