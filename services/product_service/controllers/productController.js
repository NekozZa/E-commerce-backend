const Product = require("../models/productModel");
const Component = require("../models/componentModel");
const Computer = require("../models/computer_Model");
// create product
async function buildVariantPC(basePC, variant) {
  let finalComponents = [...basePC.components];

  const overrideProducts = await Product.find({
    _id: { $in: variant.overrides },
  });

  const baseProducts = await Product.find({
    _id: { $in: basePC.components },
  });

  const baseByType = new Map();
  for (const p of baseProducts) {
    baseByType.set(p.componentType, p);
  }

  // ---------------- APPLY OVERRIDE ----------------
  for (const ov of overrideProducts) {
    const type = ov.componentType;

    // tìm linh kiện gốc thuộc type này
    const index = baseProducts.findIndex((p) => p.componentType === type);

    if (index !== -1) {
      // Replace component
      finalComponents[index] = ov._id;
    }
  }

  // ---------------- TÍNH GIÁ ----------------
  const items = await Product.find({ _id: { $in: finalComponents } });
  const totalPrice = items.reduce((sum, x) => sum + (x.price || 0), 0);

  const variantPC = new Computer({
    name: `${basePC.name} - ${variant.name}`,
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
//
function generateCombinations(groups) {
  let results = [[]];

  for (const group of groups) {
    const temp = [];
    for (const r of results) {
      for (const option of group.options) {
        temp.push([...r, option]);
      }
    }
    results = temp;
  }

  return results;
}
//////
exports.createProduct = async (req, res) => {
  try {
    const { productType } = req.body;
    let newProduct;
    switch (productType) {
      case "Component":
        newProduct = new Component(req.body);
        break;
      case "Computer":
        // const { baseComponents, variants } = req.body;
        // // Tính giá base computer
        // const baseComponentTotal = await calculateTotalPrice(baseComponents);
        // req.body.totalPrice = baseComponentTotal + (req.body.price || 0);

        // // Tính giá từng variant
        // if (variants && Array.isArray(variants)) {
        //   for (const v of variants) {
        //     const variantTotal = await calculateTotalPrice(v.components);
        //     v.totalPrice = variantTotal + (v.price || 0);
        //   }
        // }
        // newProduct = new Computer(req.body);
        // break;
        const baseComponentTotal = await calculateTotalPrice(
          req.body.components
        );
        req.body.totalPrice = baseComponentTotal + (req.body.price || 0);

        const basePCData = {
          name: req.body.name,
          baseName: req.body.baseName,
          brand: req.body.brand,
          images: req.body.images,
          description: req.body.description,
          inventory: req.body.inventory,
          productType: "Computer",
          components: req.body.components,
          totalPrice: baseComponentTotal + (req.body.price || 0),
          variants: [],
        };

        const basePC = new Computer(basePCData);
        await basePC.save();

        // Tạo PC variant
        const variantPCs = [];
        if (req.body.variants && Array.isArray(req.body.variants)) {
          for (const variant of req.body.variants) {
            const variantPC = await buildVariantPC(basePC, variant);
            variantPC.variantId = basePC._id;
            await variantPC.save();
            variantPCs.push(variantPC);
            basePC.variants.push({
              name: variant.name,
              overrides: variant.overrides,
              totalPrice: variantPC.totalPrice,
              // variantId: variantPC._id, //ID sản phẩm mới vừa tạo
            });
          }
        }
        await basePC.save();

        return res.status(201).json({
          message: "Base PC + Variant PCs created successfully",
          basePC,
          variantPCs,
        });
      default:
        newProduct = new Product(req.body);
        break;
    }
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get product by filter
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
    res.status(500).json({ message: error.message });
  }
};
//get product by id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Component.findById(id);
    if (!product) {
      product = await Computer.findById(id);
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  // try {
  //   const { id } = req.params;

  //   // Tìm product chính (Component hoặc Computer base)
  //   let product = await Component.findById(id);

  //   // Nếu không phải Component, thử tìm basePC
  //   if (!product) {
  //     product = await Computer.findById(id);
  //   }

  //   if (!product) {
  //     return res.status(404).json({ message: "Product not found" });
  //   }

  //   // Nếu product là base PC → lấy toàn bộ variantPC của nó
  //   let variants = [];
  //   if (product.type === "pc_base") {
  //     variants = await Computer.find({ variantId: id });
  //   }

  //   res.status(200).json({
  //     ...product.toObject(),
  //     variants, // thêm biến thể
  //   });
  // } catch (error) {
  //   res.status(400).json({ message: error.message });
  // }
};
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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

    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const remove = await Product.findByIdAndDelete(req.params.id);
    if (!remove) {
      res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "Delete product successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
async function calculateTotalPrice(components) {
  if (!components || components.length === 0) return 0;

  const items = await Product.find({ _id: { $in: components } });

  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}
