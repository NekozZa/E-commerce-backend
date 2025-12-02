const Product = require("../models/product.model");
// create
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// get products by filter
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
      type,
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
          type: { $regex: normalizedSearch, $options: "i" },
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
    if (variant) {
      query.variants = { $regex: new RegExp(`^${variant}$`, "i") };
    }
    if (type) {
      query.type = { $regex: new RegExp(`^${type}$`, "i") };
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
      totalPages: Math.ceil(totalFilterProducts / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get Product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//updateProduct by id
exports.updateProduct = async (req, res) => {
  try {
    const update = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!update) {
      res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(update);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//deleteProduct by id
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
exports.updateRatingInternal = async (req, res) => {
    const { id } = req.params;
    const { rating, numReviews } = req.body;
    
    try {
        await Product.findByIdAndUpdate(id, { 
            rating: rating, 
            numReviews: numReviews 
        });
        res.status(200).json({ message: 'Rating synced' });
    } catch (err) {
        res.status(500).json({ error: 'Sync failed' });
    }
  }
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
