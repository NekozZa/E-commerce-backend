const mongoose = require("mongoose");
const Product = require("./productModel");

const REQUIRED_COMPONENTS = [
  "cpu",
  "ram",
  "mainboard",
  "psu",
  "case",
  "cooler",
  "ssd",
  "vga",
];

// Hàm tính tổng giá
async function calculateTotalPrice(components) {
  if (!components || components.length === 0) return 0;

  const items = await Product.find({ _id: { $in: components } });

  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}

/* ---------------- VARIANT SCHEMA ---------------- */

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  overrides: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      //   required: true,
    },
  ],

  totalPrice: { type: Number, required: true, default: 0 },
  //   variantId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Product",
  //   },
});

// Kiểm tra override phải là component hợp lệ
variantSchema.pre("validate", async function (next) {
  try {
    if (this.overrides.length === 0) {
      return next();
    }

    const products = await Product.find({ _id: { $in: this.overrides } });

    for (const p of products) {
      if (!REQUIRED_COMPONENTS.includes(p.componentType)) {
        return next(
          new Error(`Invalid component type in variant: ${p.componentType}`)
        );
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

/* ---------------- COMPUTER SCHEMA ---------------- */

const computerSchema = new mongoose.Schema(
  {
    baseName: { type: String, required: true },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Computer",
      default: null,
    },

    components: [
      // {
      //   _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      //   name: String,
      // },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    totalPrice: { type: Number, required: true, default: 0 },

    variants: [variantSchema],
    optionGroups: [
      // option để tạo tổ hợp
      {
        type: String, // cpu, ram, vga, ...
        options: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      },
    ],
    changed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// Validate PC gốc phải đủ linh kiện
computerSchema.pre("validate", async function (next) {
  try {
    const products = await Product.find({ _id: { $in: this.components } });

    const included = new Set(products.map((p) => p.componentType));

    for (const type of REQUIRED_COMPONENTS) {
      if (!included.has(type)) {
        return next(new Error(`Computer missing required component: ${type}`));
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Auto tính totalPrice PC gốc
computerSchema.pre("save", async function (next) {
  try {
    // Tính giá base
    const baseProducts = await Product.find({ _id: { $in: this.components } });
    const baseTotal = baseProducts.reduce((sum, p) => sum + (p.price || 0), 0);
    this.totalPrice = baseTotal;

    // Tạo map componentType -> product gốc
    const baseByType = new Map();
    for (const p of baseProducts) {
      baseByType.set(p.componentType, p);
    }

    /* ---------------- TÍNH GIÁ VARIANT ---------------- */
    for (const v of this.variants) {
      let variantTotal = baseTotal;

      const overrideProducts = await Product.find({
        _id: { $in: v.overrides },
      });

      const replacedTypes = new Set();

      for (const ov of overrideProducts) {
        const type = ov.componentType;
        const ovPrice = ov.price || 0;

        // Nếu base có linh kiện cùng loại → trừ giá cũ + cộng giá mới
        if (baseByType.has(type) && !replacedTypes.has(type)) {
          const oldPrice = baseByType.get(type).price || 0;

          variantTotal = variantTotal - oldPrice + ovPrice;

          replacedTypes.add(type);
        } else {
          // Nếu base không có linh kiện cùng loại → chỉ cộng thêm giá override
          variantTotal += ovPrice;
        }
      }

      // Lưu giá cuối cùng
      v.totalPrice = variantTotal;
    }

    next();
  } catch (err) {
    next(err);
  }
});

const Computer = Product.discriminator("Computer", computerSchema);
module.exports = Computer;
