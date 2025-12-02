const Product = require("../models/productModel");
const Component = require("../models/componentModel");
const Computer = require("../models/computer_Model");

// Hàm tính tổng giá
async function calculateTotalPrice(componentIds) {
  if (!componentIds || componentIds.length === 0) return 0;
  const items = await Product.find({ _id: { $in: componentIds } });
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}

// Tạo tất cả tổ hợp variants
function generateCombinations(optionGroups) {
  let results = [[]];
  for (const group of optionGroups) {
    const temp = [];
    for (const r of results) {
      for (const option of group.options) {
        if (!option) continue; // bỏ null
        temp.push([...r, { type: group.type, productId: option }]);
      }
    }
    results = temp;
  }
  return results;
}
// buildVariantPCFromCombination.js
async function buildVariantPCFromCombination1(basePC, combo) {
  // Lấy baseProducts đầy đủ từ DB
  const baseProducts = await Product.find({
    _id: { $in: basePC.components.map((c) => c._id) },
  });

  // Tạo map: componentType -> Product
  const baseMap = new Map();
  for (const p of baseProducts) {
    baseMap.set(p.componentType, p);
  }

  // Copy base components
  const finalComponentsMap = new Map();
  for (const [type, p] of baseMap.entries()) {
    finalComponentsMap.set(type, { _id: p._id, name: p.name });
  }

  // Thay thế theo combo
  for (const override of combo) {
    const prod = await Product.findById(override.productId);
    if (!prod) continue;
    const baseComp = baseMap.get(override.type);
    if (baseComp?._id.equals(prod._id)) continue;
    // Override theo componentType
    finalComponentsMap.set(override.type, { _id: prod._id, name: prod.name });
  }

  // Convert map -> array
  const finalComponents = Array.from(finalComponentsMap.values());
  const isSameAsBase = finalComponents.every((c) =>
    basePC.components.some((bc) => bc._id.equals(c._id))
  );

  if (isSameAsBase) {
    // Không tạo variant giống base
    return null;
  }
  // Tính totalPrice
  const totalPrice = await calculateTotalPrice(
    finalComponents.map((c) => c._id)
  );

  // Tạo variant
  const variantPC = new Computer({
    name: `${basePC.name} - ${combo.map((c) => c.type).join(" + ")}`,
    baseName: basePC.baseName,
    brand: basePC.brand,
    images: basePC.images,
    description: basePC.description,
    inventory: basePC.inventory,
    productType: "Computer",
    components: finalComponents,
    totalPrice,
    variants: [],
    variantId: basePC._id,
  });

  return variantPC;
}
// createProduct controller
exports.createProduct1 = async (req, res) => {
  try {
    const BASE_URL = `${req.protocol}://${req.get("host")}`;
    const normalizeImages = (images) => {
      return (images || []).map((img) =>
        img.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`
      );
    };

    req.body.images = normalizeImages(req.body.images);
    const { productType } = req.body;

    if (productType === "Component") {
      const newComponent = new Component(req.body);
      await newComponent.save();
      return res.status(201).json(newComponent);
    }

    if (productType === "Computer") {
      const { components, optionGroups } = req.body;

      // Base components
      const baseProducts = await Product.find({ _id: { $in: components } });
      const baseComponents = baseProducts.map((p) => ({
        _id: p._id,
        name: p.name,
      }));

      const baseTotal = await calculateTotalPrice(components);

      const basePC = new Computer({
        name: req.body.name,
        baseName: req.body.baseName,
        brand: req.body.brand,
        images: req.body.images,
        description: req.body.description,
        inventory: req.body.inventory,
        productType: "Computer",
        components: baseComponents,
        totalPrice: baseTotal,
        variants: [],
        variantId: null,
      });

      await basePC.save();

      let createdVariants = [];
      const skippedCombos = [];

      if (Array.isArray(optionGroups) && optionGroups.length > 0) {
        const combos = generateCombinations(optionGroups);

        for (const combo of combos) {
          if (!Array.isArray(combo) || combo.length === 0) {
            skippedCombos.push({ combo, reason: "Empty combo" });
            continue;
          }

          const comboIds = combo.map((c) => String(c.productId));
          if (new Set(comboIds).size !== comboIds.length) {
            skippedCombos.push({
              combo,
              reason: "Duplicate productId in combo",
            });
            continue;
          }

          // Build variant
          let variantPC;
          try {
            variantPC = await buildVariantPCFromCombination1(basePC, combo);
            if (!variantPC) {
              skippedCombos.push({
                combo,
                reason: "Variant identical to basePC",
              });
              continue; // skip combo
            }
            const changedComponents = [];
            for (const override of combo) {
              const baseComp = basePC.components.find(
                (c) => c._id.toString() === override.productId
              );
              if (!baseComp) changedComponents.push(override.productId);
              else if (baseComp._id.toString() !== override.productId)
                changedComponents.push(override.productId);
            }

            // Lưu changed vào variantPC
            variantPC.changed = changedComponents;
          } catch (err) {
            skippedCombos.push({
              combo,
              reason: "Error building variant: " + err.message,
            });
            continue;
          }

          await variantPC.save();

          basePC.variants.push({
            name: variantPC.name,
            overrides: combo.map((c) => c.productId),
            totalPrice: variantPC.totalPrice,
          });

          createdVariants.push(variantPC);
        }

        await basePC.save();
      }

      return res.status(201).json({
        message: "Base PC created. Variants processed.",
        basePC,
        variants: createdVariants,
        skippedCombos,
      });
    }

    // DEFAULT PRODUCT
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.getVariant = async (req, res) => {
  const { basePCId, selectedOptions } = req.body;

  const basePC = await Computer.findById(basePCId).lean();

  if (!basePC) return res.status(404).json({ message: "Base PC not found" });

  // 1️⃣ Kiểm tra trong variants có sẵn
  const variant = basePC.variants.find((v) => {
    const sortedOverrides = v.overrides.map(String).sort();
    const sortedSelected = selectedOptions.map(String).sort();
    return JSON.stringify(sortedOverrides) === JSON.stringify(sortedSelected);
  });

  if (variant) {
    return res.json({ product: variant });
  }

  // 2️⃣ Nếu không có, build variant mới
  const combo = selectedOptions.map((id) => {
    const comp = basePC.components.find((c) => c._id.toString() === id);
    return { type: comp ? comp.componentType : null, productId: id };
  });

  let newVariant;
  try {
    newVariant = await buildVariantPCFromCombination1(basePC, combo);
    await newVariant.save();

    // Thêm vào basePC.variants
    basePC.variants.push({
      name: newVariant.name,
      overrides: selectedOptions,
      totalPrice: newVariant.totalPrice,
    });
    await Computer.findByIdAndUpdate(basePCId, { variants: basePC.variants });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  return res.json({ product: newVariant });
};
exports.getProduct = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "name",
      order = "asc",
      brand,
      minPrice,
      maxPrice,
      variant,
      productType,
      componentType,
    } = req.query;
    const query = {};
    if (search) {
      const normalizedSearch = removeVietnameseTones(search).toLowerCase();
      query.$or = [
        {
          name: { $regex: normalizedSearch, $options: "i" },
        },
        {
          description: { $regex: normalizedSearch, $options: "i" },
        },
        {
          keyword: { $regex: normalizedSearch, $options: "i" },
        },
        {
          brand: { $regex: normalizedSearch, $options: "i" },
        },
      ];
    }
    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, "i") };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }
    if (productType) {
      query.productType = productType;
    }
    if (componentType) {
      query.componentType = componentType;
    }
    const skipProducts = (page - 1) * limit;
    const sortOptions = { [sort]: order === "desc" ? -1 : 1 };
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skipProducts)
      .limit(Number(limit));
    const totalFilterProducts = await Product.countDocuments(query);
    res.status(200).json({
      totalFilterProducts,
      page: Number(page),
      totalPages: Math.ceil(totalFilterProducts / Number(limit)),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let Model = Product;

    if (product.productType === "Component") {
      Model = Component;
    } else if (product.productType === "Computer") {
      // Model = Computer;
      // let newComponents = req.body.components || product.components;
      // let newBasePrice = req.body.price ?? product.price;

      // const componentTotal = await calculateTotalPrice(newComponents);

      // req.body.totalPrice = newBasePrice + componentTotal;
      let newBaseComponents = req.body.baseComponents || product.baseComponents;

      const baseTotal = await calculateTotalPrice(newBaseComponents);
      req.body.totalPrice = baseTotal + (req.body.price || product.price);

      // UPDATE VARIANTS
      if (req.body.variants) {
        for (const v of req.body.variants) {
          const variantTotal = await calculateTotalPrice(v.components);
          v.totalPrice = variantTotal + (v.price || 0);
        }
      }
    }

    console.log(req.body);

    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const remove = await Product.findByIdAndDelete(req.params.id);
    if (!remove) {
      res.status(404).json({ error: "product not found" });
    }
    res.status(200).json({ message: "Delete product successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
exports.getVariantByChanged = async (req, res) => {
  try {
    const basePCId = req.params.id;
    const { changed = [] } = req.body;

    // 1️⃣ Tìm variant riêng biệt
    const variant = await Computer.findOne({
      variantId: basePCId,
      changed: { $size: changed.length, $all: changed },
    }).populate("components");

    if (variant) {
      return res.json({ product: variant });
    }

    // 2️⃣ Nếu không tìm thấy → trả về basePC gốc
    const basePC = await Computer.findById(basePCId).populate("components");
    if (!basePC) return res.status(404).json({ error: "Base PC not found" });

    // Trả basePC nhưng gán changed = input
    return res.json({
      product: {
        ...basePC.toObject(),
        changed,
        variantId: basePC._id,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Tìm product bất kỳ trong collection Product
    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Nếu là Computer, lấy components chi tiết + variants
    if (product.productType === "Computer") {
      const basePC = await Computer.findById(id).populate("components").lean();

      // Lấy các variant của Computer
      const variants = await Computer.find({ variantId: id })
        .populate("components")
        .lean();

      const mapComponents = (arr) =>
        arr.map((c) => ({
          _id: c._id,
          name: c.name || "",
          price: c.price || 0,
          componentType: c.componentType,
        }));

      basePC.components = mapComponents(basePC.components);
      variants.forEach((v) => (v.components = mapComponents(v.components)));

      return res.json({
        product: basePC,
        variants,
      });
    }

    // 3️⃣ Nếu là Component, trả về luôn
    return res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
