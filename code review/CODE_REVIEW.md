# Code Review: Expense Tracker Backend

---

## 1. Security Vulnerabilities & Fixes

### 1.1 Unprotected Endpoints & IDOR (Insecure Direct Object Reference)
**Issue:** `searchRoute.js` and `transactionRoute.js` contain endpoints with no authentication middleware. Additionally, operations do not restrict access to the logged-in user's data.

#### ❌ Before (Current Code):
```javascript
// routes/searchRoute.js - Unauthenticated & deletes ANY transaction by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const deleted = await Transaction.findByIdAndDelete(req.params.id); // Dangerous IDOR
        res.json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// routes/transactionRoute.js - Returns ALL transactions from ALL users
router.get("/dashboard", async (req, res) => {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
});
```

#### ✅ After (Improved Code):
```javascript
// routes/transactionRoutes.js - Authenticated & scoped to logged-in user
router.delete("/transactions/:id", authMiddleware, async (req, res) => {
    try {
        const deleted = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id // Verifies transaction belongs to current user
        });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Transaction not found or unauthorized" });
        }

        res.json({ success: true, message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
```

---

### 1.2 Hardcoded Secrets & Missing `.gitignore`
**Issue:** Database credentials and JWT secret are hardcoded in `.env`, and there is no `.gitignore` file to prevent pushing secrets or `node_modules` to Git repositories.

#### ❌ Before (Current Code):
```env
# .env file committed without .gitignore
MONGO_URI = mongodb+srv://hv04090_db_user:8h8fskkKvqJtcsMa@cluster0.mpxor3m.mongodb.net/?appName=Cluster0
JWT_SECRET=8118198
```

#### ✅ After (Improved Code):
Create a `.gitignore` file in project root:
```gitignore
node_modules/
.env
.env.local
*.log
```
Create a `.env.example` file for team members:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

---

### 1.3 Exposure of Password Hashes in API Responses
**Issue:** `settingRoute.js` returns the full `user` document including the hashed `password` field upon profile updates.

#### ❌ Before (Current Code):
```javascript
// routes/settingRoute.js
router.put("/update-name", authMiddleware, async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true });
    res.json(user); // Exposes password hash to client
});
```

#### ✅ After (Improved Code):
```javascript
// routes/settingRoute.js
router.put("/update-name", authMiddleware, async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name },
        { new: true }
    ).select("-password"); // Excludes password field

    res.json({ success: true, data: user });
});
```

---

### 1.4 Regular Expression Denial of Service (ReDoS)
**Issue:** Passing unescaped user input directly into `$regex` in `searchRoute.js` can allow malicious users to freeze the server CPU using payload pattern expressions.

#### ❌ Before (Current Code):
```javascript
// routes/searchRoute.js
const key = req.params.key;
const conditions = [{ category: { $regex: key, $options: "i" } }];
```

#### ✅ After (Improved Code):
```javascript
// Safely escape special regex characters or use query string
const safeKey = req.params.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const conditions = [
    { category: { $regex: safeKey, $options: "i" }, user: req.user.id }
];
```

---

### 1.5 Account Enumeration on Login
**Issue:** Login returns explicit messages distinguishing between non-existent emails vs wrong passwords.

#### ❌ Before (Current Code):
```javascript
// routes/authRoute.js
if (!UserExists) {
    return res.status(404).json({ message: "User does not exist" }); // Exposes registered emails
}
if (!isMatch) {
    return res.status(401).json({ message: "Invalid Password" });
}
```

#### ✅ After (Improved Code):
```javascript
// routes/authRoute.js
if (!UserExists || !(await bcrypt.compare(password, UserExists.password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
}
```

---

### 1.6 Insecure Cookie Configuration
**Issue:** Cookies are set without security attributes like `sameSite` or production `secure` flags.

#### ❌ Before (Current Code):
```javascript
res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
});
```

#### ✅ After (Improved Code):
```javascript
res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Transmit over HTTPS only in prod
    sameSite: "strict", // Protects against CSRF
    maxAge: 24 * 60 * 60 * 1000
});
```

---

## 2. Critical Bugs & Syntax Errors

### 2.1 Mongoose Schema Typo (`require` vs `required`)
**Issue:** In `models/User.js`, `require: true` is used instead of `required: true`. Mongoose ignores `require`, rendering schema validation inactive.

#### ❌ Before (Current Code):
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true }
});
```

#### ✅ After (Improved Code):
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    age: { type: Number, min: 1 },
    password: { type: String, required: [true, "Password is required"], minlength: 6 }
}, { timestamps: true });
```

---

### 2.2 Case-Sensitive File Import Bug
**Issue:** `routes/authRoute.js` and `routes/settingRoute.js` import `../models/user` (lowercase `u`). The actual file is `User.js` (capital `U`). This crashes on Linux/Docker deployments.

#### ❌ Before (Current Code):
```javascript
const User = require("../models/user"); // Fails on Linux/Mac/Docker
```

#### ✅ After (Improved Code):
```javascript
const User = require("../models/User"); // Matches exact filename casing
```

---

### 2.3 `dotenv.config()` Invocation Order in `server.js`
**Issue:** `dotenv.config()` is invoked after requiring `./config/db`. If database config reads environment variables during module initialization, `process.env` values will be `undefined`.

#### ❌ Before (Current Code):
```javascript
// server.js
const connectDB = require("./config/db");
dotenv.config(); // Called too late!
connectDB();
```

#### ✅ After (Improved Code):
```javascript
// server.js
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables FIRST before any local imports

const connectDB = require("./config/db");
connectDB();
```

---

## 3. Architecture & Separation of Concerns (MVC Pattern)

**Issue:** Route handler logic is tightly coupled within route files. Moving logic into Controllers makes code clean, reusable, and readable.

### ❌ Before (Current Code):
`routes/transactionRoute.js` defines route path, business logic, DB queries, and response logic together:
```javascript
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { amount, date, category, description, type } = req.body;
        const transaction = await Transaction.create({ amount, date, category, description, type, user: req.user.id });
        res.status(201).json({ success: true, message: "Transaction Added", transaction });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
```

### ✅ After (Improved Code):

**1. Create Controller (`controllers/transactionController.js`):**
```javascript
const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res, next) => {
    try {
        const { amount, date, category, description, type } = req.body;

        const transaction = await Transaction.create({
            amount,
            date: date || new Date(),
            category,
            description,
            type,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Transaction added successfully",
            data: transaction
        });
    } catch (err) {
        next(err); // Passed to central error handler
    }
};
```

**2. Clean Route File (`routes/transactionRoutes.js`):**
```javascript
const express = require("express");
const router = express.Router();
const { addTransaction } = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/transactions", authMiddleware, addTransaction);

module.exports = router;
```

---

## 4. Centralized Configuration & Environment Validation

Instead of reading `process.env.VAR` randomly across different files, aggregate environment variables into a single, validated config module (`config/env.js`). If a required environment variable is missing, the application should **fail fast** on startup with a clear error message.

### Example Centralized Config (`config/env.js`):
```javascript
const dotenv = require("dotenv");
dotenv.config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`❌ FATAL ERROR: Missing required environment variable "${envVar}".`);
        process.exit(1); // Exit process immediately
    }
}

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
    nodeEnv: process.env.NODE_ENV || "development"
};
```

---

## 5. REST API Design & Standard Naming Conventions

### 5.1 Model & File Naming Conventions
- Model names should be singular PascalCase (`Transaction.js` instead of `Transactions.js`).
- Route file names should be uniform (e.g. `transactionRoutes.js`, `userRoutes.js`).

### 5.2 Restructuring Endpoint Routes
In RESTful API design:
- HTTP methods describe the action (`GET`, `POST`, `PUT`, `DELETE`).
- Endpoint paths describe the resource in plural nouns (`/api/transactions`).

#### ❌ Bad Endpoint Structure:
- `POST /api/add`
- `GET /api/expenses`
- `GET /api/income`
- `DELETE /api/delete/:id`
- `GET /api/logout`

#### ✅ RESTful Endpoint Structure:
- `POST /api/transactions` (Create transaction)
- `GET /api/transactions` (Fetch all transactions)
- `GET /api/transactions?type=Expense` (Fetch expenses using query params)
- `GET /api/transactions?type=Income` (Fetch income using query params)
- `DELETE /api/transactions/:id` (Delete transaction)
- `POST /api/auth/logout` (Logout user via POST)

---

## 6. Good-to-Have Features for Production Readiness

### 6.1 API Rate Limiting
Protect your backend against Denial of Service (DoS) and brute-force login attacks using `express-rate-limit`:

```javascript
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: "Too many requests, please try again later." }
});

app.use("/api/", apiLimiter);
```

### 6.2 Request Input Validation (Zod / Joi)
Validate request bodies before hitting controllers so invalid data is rejected at the entry point:

```javascript
// Example using Zod middleware
const { z } = require("zod");

const createTransactionSchema = z.object({
    amount: z.number().positive("Amount must be greater than zero"),
    category: z.string().min(1, "Category is required"),
    type: z.enum(["Income", "Expense"])
});

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ success: false, errors: result.error.errors });
    }
    next();
};
```

### 6.3 Health Check Endpoint
Add a `/health` route for cloud platforms (AWS, Docker, K8s) to verify instance health:

```javascript
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
```

### 6.4 Graceful Shutdown
Handle process termination signals (`SIGTERM`, `SIGINT`) to close database connections cleanly before exiting:

```javascript
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    await mongoose.connection.close();
    server.close(() => process.exit(0));
});
```

---

## 7. Pro Tips for Junior Engineers & Interns

1. **Adopt the "Fail Fast" Mindset:**  
   Validate inputs and check conditions early. If something is missing or invalid, return immediately (`return res.status(400)...`) rather than nesting deep `if/else` statements.

2. **Never Hardcode Magic Numbers or Strings:**  
   Instead of writing `24 * 60 * 60 * 1000` or `"Expense"` directly in multiple places, define constants in a dedicated `constants/` file.

3. **Always Document Your APIs:**  
   Export a Postman Collection or write a basic `README.md` describing request parameters, headers, and example responses for every endpoint.

4. **Read Error Stack Traces Top to Bottom:**  
   When an error occurs, look for the first line pointing to *your written files* (`at .../routes/...`) rather than skimming through `node_modules` lines.

5. **Set Up Linting & Formatting Early:**  
   Use **ESLint** and **Prettier** in your IDE. Automated formatting eliminates syntax typos (like `require: true`) and keeps code formatting clean across the team.
