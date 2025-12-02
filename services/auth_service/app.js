require("dotenv").config();

const express = require("express");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { check, validationResult } = require("express-validator");

const User = require("./models/userModel");
const AuthProvider = require("./models/authProviderModel");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_LOGIN_SECRET = process.env.JWT_LOGIN_SECRET;
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const EXPIRY = 2; // phút

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key", 
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- GOOGLE STRATEGY 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/oauth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails[0].value;
        const userAuth = await AuthProvider.findOne({
          providerUserId: profile.id,
        });

        if (!userAuth) {
          const user = await User.create({
            email: googleEmail,
            fullName: profile.displayName, 
          });

          await AuthProvider.create({
            userId: user._id,
            providerName: "google",
            providerUserId: profile.id,
          });

          done(null, user);
        } else {
          const user = await User.findOne({ _id: userAuth.userId });
          done(null, user);
        }
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize/Deserialize user cho Passport session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// --- ROUTES ---

app.get(
  "/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/oauth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    const authToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_LOGIN_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: authToken });
  }
);

// Validate Register: Thêm check độ dài password nếu người dùng có nhập
const validateRegister = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

app.post("/register", validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const dryrun = req.query.dryrun;
  const { email, password, fullName } = req.body; // Nhận thêm fullName và password

  // Kiểm tra trùng email
  if (await User.findOne({ email, password: { $exists: true } })) {
    return res.status(400).json({ error: "This email was used" });
  }


  let finalPassword = password;
  let isGenerated = false;

  if (!finalPassword) {
    finalPassword = generatePassword(); // Hàm sinh pass ngẫu nhiên
    isGenerated = true;
  }

  const hashedPassword = await bcrypt.hash(finalPassword, 10);
  const expiredDate = new Date(Date.now() + EXPIRY * 60 * 1000);

  
  const user = new User({
    email,
    password: hashedPassword,
    fullName: fullName || "", // Lưu fullName
    expiredDate,
  });

  if (dryrun) {
    return res.json({ user });
  }

  user
    .save()
    .then(() => {
      if (isGenerated) {
        // Case 1: Tự sinh pass (User không nhập) -> Trả về pass để hiển thị
        res
          .status(201)
          .json({
            message: "User created with temporary password",
            password: finalPassword,
          });
      } else {
        // Case 2: User tự nhập pass -> Không trả lại pass (Bảo mật)
        res.status(201).json({ message: "User registered successfully" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Database error: " + err.message });
    });
});

app.get("/register/callback", async (req, res) => {
  const { email } = req.query;
  await User.updateOne(
    { email, password: { $exists: true } },
    { $unset: { expiredDate: "" } }
  );
  res.status(200).json({ message: "Success" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password: { $exists: true } });

  if (
    !user ||
    !user.password ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // Tạm comment đoạn check expired để test cho dễ, uncomment nếu cần tính năng verify email
  /* else if (user && user.expiredDate) {
        return res.status(401).json({error: "Verify your email"})
    } */

  const authToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role || "customer" },
    JWT_LOGIN_SECRET,
    { expiresIn: "1h" }
  );
  res.status(200).json({ token: authToken });
});

app.post("/reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, password: { $exists: true } });

  if (!user) {
    return res.status(404).json({ error: "Account not found!" });
  }

  const resetToken = jwt.sign({ email: user.email }, JWT_RESET_SECRET, {
    expiresIn: "15m",
  });
  res.status(200).json({ token: resetToken });
});

app.put("/reset", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_RESET_SECRET);

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({
      email: payload.email,
      password: { $exists: true },
    });

    const dryrun = req.query.dryrun;
    if (dryrun) {
      return res.status(200).json({
        email: user.email,
        password: hashedPassword,
      });
    }

    await User.updateOne(
      { email: user.email, password: { $exists: true } },
      { password: hashedPassword }
    );
    return res.status(200).json({ message: "Password is updated" });
  } catch {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

const generatePassword = () => {
  return crypto.randomBytes(12).toString("hex");
};

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
