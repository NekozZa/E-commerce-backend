const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cartRoutes");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
