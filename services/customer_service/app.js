require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const Customer = require("./models/customerModel");

const app = express();
const PORT = process.env.PORT | 3000;
const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET;

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const validateInfo = [
  check("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  check("addresses")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Must have one address"),
  check("addresses.*")
    .trim()
    .notEmpty()
    .withMessage("Address must not be empty"),
];

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Invalid credentials" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const { id, email, role } = jwt.verify(token, JWT_LOGIN_SECRET);

    req.user = { id: id, email: email, role: role };

    next();
  } catch {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/customers", async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(403).json({ error: "Unauthorized!" });
  }

  const { orderFields = "fullname:asc", page = 1, limit = 10 } = req.query;
  const fields = orderFields.split(",");
  const sorts = {};

  fields.forEach((field) => {
    const [fieldName, sortDirection] = field.split(":");
    sorts[fieldName] = sortDirection == "asc" ? 1 : -1;
  });

  const customers = await Customer.find()
    .sort(sorts)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({ customers: customers });
});

app.get("/customers/me", async (req, res) => {
  console.log("GET /customers/me - User ID:", req.user?.id);

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let customer = await Customer.findOne({ _id: req.user.id });

  // If customer doesn't exist, create one automatically
  if (!customer) {
    console.log(
      "Customer not found, creating new customer for user:",
      req.user.id
    );
    customer = new Customer({
      _id: req.user.id,
      fullname: req.user.email?.split("@")[0] || "User",
      email: req.user.email,
      addresses: [],
      loyaltyPoint: 0,
    });
    await customer.save();
  }

  const customerData = {
    ...customer.toObject(),
    fullName: customer.fullname,
  };
  delete customerData.fullname;
  res.status(200).json({ customerDetails: customerData });
});

app.get("/customers/:id", async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(403).json({ error: "Unauthorized!" });
  }

  const customer = await Customer.findOne({ _id: req.params.id });
  res.status(200).json({ customerDetails: customer });
});

app.post("/customers", validateInfo, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  if (await Customer.findOne({ _id: req.user.id })) {
    return res.status(409).json({ error: "Customer is already existed!" });
  }

  const dryrun = req.query.dryrun;
  const { fullName, addresses } = req.body;

  const customer = new Customer({
    _id: req.user.id,
    fullname: fullName,
    email: req.user.email,
    addresses: addresses,
  });

  if (dryrun) {
    return res.json(customer);
  }

  customer
    .save()
    .then(() => {
      res.status(201).json({ message: "Customer added" });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

app.post("/customers/me/addresses", async (req, res) => {
  const dryrun = req.query.dryrun;
  const { addresses } = req.body;

  const customer = await Customer.findOne({ _id: req.user.id });

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const newAddresses = customer.addresses;

  addresses.forEach((address) => {
    newAddresses.push(address);
  });

  if (dryrun) {
    return res.json(addresses);
  }

  await Customer.updateOne({ _id: req.user.id }, { addresses: newAddresses });
  res.status(200).json({ message: "Successfully updated" });
});

app.put("/customers/:id", validateInfo, async (req, res) => {
  const id = req.params.id;

  if (req.user.id != id && req.user.role != "admin") {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const dryrun = req.query.dryrun;
  const { fullName, addresses, loyaltyPoint } = req.body;

  if (dryrun) {
    return res.json({ fullName, addresses });
  }

  console.log(loyaltyPoint);

  await Customer.updateOne(
    { _id: id },
    { fullname: fullName, addresses, loyaltyPoint }
  );
  res.status(200).json({ message: "Successfully updated" });
});

app.delete("/customers/:id", async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(403).json({ error: "Unauthorized!" });
  }

  const id = req.params.id;
  await Customer.deleteOne({ _id: id });

  res.status(200).json({ message: "Successfully deleted" });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
