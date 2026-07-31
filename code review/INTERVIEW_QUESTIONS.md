# Technical Interview Preparation Guide: Expense Tracker Backend

This guide contains **30 essential interview questions & detailed answers** directly relevant to this project. It is divided into 3 core sections: **JavaScript**, **Node.js & Express**, and **Backend, Database & Security**.

---

## Section 1: Core JavaScript & ES6+

### Q1: What are JavaScript Promises, and how does `async/await` work under the hood?
**Answer:**
A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It has 3 states: `pending`, `fulfilled`, or `rejected`.

`async/await` is syntactic sugar built on top of Promises:
- Marking a function `async` automatically wraps its return value in a resolved Promise.
- The `await` keyword pauses execution inside the async function until the Promise settles, without blocking the main event loop thread.

```javascript
// Promise syntax:
User.findOne({ email }).then(user => { ... }).catch(err => { ... });

// async/await syntax:
try {
  const user = await User.findOne({ email });
} catch (err) {
  console.error(err);
}
```

---

### Q2: What is the difference between `var`, `let`, and `const`?
**Answer:**
- **`var`**: Function-scoped or globally-scoped. It is hoisted to the top of its scope and initialized with `undefined`. Re-declaration is allowed (which causes bugs).
- **`let`**: Block-scoped (`{}`). It is hoisted but remains in a "Temporal Dead Zone" until declared. Cannot be re-declared in the same scope. Can be reassigned.
- **`const`**: Block-scoped like `let`. Cannot be reassigned or re-declared. However, objects/arrays declared with `const` can still have their properties mutated.

---

### Q3: What is the difference between `==` and `===` in JavaScript?
**Answer:**
- **`==` (Abstract Equality)**: Performs type coercion if the types of operands are different before comparing values (e.g., `'5' == 5` evaluates to `true`).
- **`===` (Strict Equality)**: Compares both **value** and **type** without type conversion (e.g., `'5' === 5` evaluates to `false`).

*Best Practice:* Always use `===` in backend development to prevent unexpected type coercion bugs.

---

### Q4: Explain the JavaScript Event Loop, Call Stack, Microtask, and Macrotask queues.
**Answer:**
JavaScript is single-threaded. The **Event Loop** constantly monitors the Call Stack and task queues:
1. **Call Stack**: Executes synchronous code line-by-line.
2. **Microtask Queue**: Contains high-priority async callbacks like `Promise` resolves/rejects, `process.nextTick()`, and `queueMicrotask()`.
3. **Macrotask Queue**: Contains I/O tasks, `setTimeout()`, `setInterval()`, and `setImmediate()`.

*Execution Order:* Synchronous code runs first -> Entire Microtask Queue drains -> One Macrotask runs -> Microtask Queue drains again.

---

### Q5: What is a JavaScript Closure and how is it used in Node.js middleware?
**Answer:**
A **closure** is a function that retains access to variables from its outer (enclosing) lexical scope, even after the outer function has finished executing.

```javascript
// Express middleware factory using closure:
const authorizeRole = (requiredRole) => {
  // 'requiredRole' is captured in closure
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
```

---

### Q6: What is the difference between `isNaN()` and `Number.isNaN()`?
**Answer:**
- **`isNaN(val)`**: Coerces `val` to a Number first before checking. E.g., `isNaN("hello")` evaluates to `true` because `"hello"` coerces to `NaN`.
- **`Number.isNaN(val)`**: Strict check. Returns `true` ONLY if `val` is actually of type Number AND its value is `NaN`. `Number.isNaN("hello")` returns `false`.

---

### Q7: Explain `map()`, `filter()`, and `reduce()` array methods.
**Answer:**
- **`map()`**: Returns a new array with transformed elements.
- **`filter()`**: Returns a new array containing elements that pass a test condition.
- **`reduce()`**: Accumulates array values into a single output value (e.g., total expense sum).

```javascript
const transactions = [{ amount: 100 }, { amount: 250 }, { amount: 50 }];
const totalExpense = transactions.reduce((acc, curr) => acc + curr.amount, 0); // 400
```

---

### Q8: What is Object Destructuring and Spread Syntax (`...`)?
**Answer:**
- **Destructuring**: Unpacks values from arrays or properties from objects into distinct variables.
- **Spread Syntax**: Expands an iterable into individual elements.

```javascript
// Destructuring request body
const { amount, category, type } = req.body;

// Spread to clone object
const updatedData = { ...req.body, updatedAt: new Date() };
```

---

### Q9: What is Callback Hell and how do Promises solve it?
**Answer:**
Callback Hell occurs when multiple nested asynchronous callbacks make code deeply indented, hard to read, and difficult to handle errors. Promises allow chaining (`.then()`), and `async/await` allows writing asynchronous code in a clean, linear synchronous style.

---

### Q10: How does error handling work with `try/catch` in async functions?
**Answer:**
When an exception occurs inside an `async` function or an `await` expression rejects, control jumps to the `catch (err)` block. If an error is not caught inside a `try/catch` block or handled by `.catch()`, it produces an **Unhandled Promise Rejection**, which can crash Node.js processes.

---

## Section 2: Node.js & Express Framework

### Q11: What makes Node.js event-driven and non-blocking?
**Answer:**
Node.js uses an event-driven architecture powered by the **libuv** C library. When Node performs I/O operations (reading DB, writing files, network calls), it delegates the operation to the OS kernel or a worker thread pool and continues executing other code. When the operation finishes, a callback is emitted to the Event Loop queue.

---

### Q12: How do Express Middlewares work? What is `next()`?
**Answer:**
An Express middleware is a function with access to `req` (request object), `res` (response object), and `next` (function to pass control to the next middleware).

If a middleware does not call `next()` or end the response (`res.send()`, `res.json()`), the request will hang indefinitely.

---

### Q13: What is the difference between `CommonJS` and `ES Modules`?
**Answer:**
- **CommonJS (CJS)**: Uses `require()` and `module.exports`. Synchronous loading. Native standard in traditional Node.js.
- **ES Modules (ESM)**: Uses `import` and `export`. Asynchronous loading. Standard in modern JavaScript / browser / React environments.

---

### Q14: Why should you avoid synchronous functions like `fs.readFileSync()` in Express handlers?
**Answer:**
Node.js processes HTTP requests on a single main thread. Calling synchronous blocking operations blocks the entire main thread, preventing the server from handling requests from any other users until the operation completes.

---

### Q15: How does `cookie-parser` work, and how do HTTP cookies differ from LocalStorage?
**Answer:**
- `cookie-parser` populates `req.cookies` by parsing the HTTP `Cookie` request header.
- **HTTP Cookies (`httpOnly`)**: Transmitted automatically in HTTP headers with requests to the server. `httpOnly` prevents JavaScript access (`document.cookie`), making them safe against XSS attacks.
- **LocalStorage**: Stored in client browser JS memory; accessible via client script (vulnerable to XSS theft).

---

### Q16: What is the difference between `req.params`, `req.query`, and `req.body`?
**Answer:**
- `req.params`: Route parameters defined in URL path (e.g., `/api/transactions/:id` -> `req.params.id`).
- `req.query`: Query string parameters after `?` (e.g., `/api/transactions?type=Expense` -> `req.query.type`).
- `req.body`: Data sent in HTTP request payload (requires `express.json()` middleware).

---

### Q17: How do you write a centralized Error Handling Middleware in Express?
**Answer:**
An Express error handler middleware MUST accept 4 arguments `(err, req, res, next)`:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
```

---

### Q18: Why is environment variable configuration (`dotenv`) critical?
**Answer:**
`dotenv` loads environment variables from a `.env` file into `process.env`. It keeps secret keys (DB URIs, API keys, JWT secrets) out of source control. `dotenv.config()` must be called at the very top of application entry point (`server.js`) before importing modules that depend on `process.env`.

---

### Q19: What is CORS and how does Express handle preflight requests?
**Answer:**
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that restricts web applications running on one domain (e.g., `http://localhost:5173`) from making requests to an API on another domain (e.g., `http://localhost:5000`). Browsers send a preflight `OPTIONS` request to check server headers before allowing requests with credentials or custom headers.

---

### Q20: How do Express 4 and Express 5 differ in handling asynchronous errors?
**Answer:**
- **Express 4**: Errors thrown inside `async` route handlers are NOT automatically caught. You must use `try/catch` and pass errors to `next(err)` or use wrapper libraries like `express-async-handler`.
- **Express 5**: Automatically catches rejected Promises in `async` route handlers and forwards them to the error-handling middleware.

---

## Section 3: Backend Architecture, Databases & Security

### Q21: What is JWT (JSON Web Token) and how does it work?
**Answer:**
JWT is a compact, URL-safe token used for stateless authentication. It consists of 3 parts separated by dots (`.`):
1. **Header**: Algorithm and token type.
2. **Payload**: User identity claims (e.g., `{ id: userId }`).
3. **Signature**: Cryptographic hash created using secret key to prevent tampering.

The client sends the token in a cookie or `Authorization: Bearer <token>` header. The server verifies the signature without needing to query the database on every request.

---

### Q22: What is password hashing and what are `bcrypt` salt rounds?
**Answer:**
Passwords must never be stored in plain text. Hashing is a one-way mathematical transformation.
**Bcrypt** adds a random string called a **Salt** to the password before hashing to prevent Rainbow Table dictionary attacks. **Salt Rounds** (e.g., 10) control how computationally expensive the hashing algorithm is, protecting against brute-force attacks.

---

### Q23: What is an IDOR vulnerability and how do you prevent it?
**Answer:**
**IDOR (Insecure Direct Object Reference)** occurs when an application exposes a reference to an internal object (like a transaction ID in `/delete/:id`) without validating whether the requesting user owns that resource.

*Fix:* Always combine resource ID with the authenticated user ID in database queries:
`Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id })`.

---

### Q24: What is the difference between SQL and NoSQL (MongoDB)?
**Answer:**
- **SQL (Relational)**: Structured table schemas with fixed columns and relational foreign keys. Good for complex joins and transactional integrity (ACID).
- **NoSQL (MongoDB)**: Document-oriented database using JSON-like (BSON) documents. Flexible schemas, high horizontal scalability. In Mongoose, we reference related documents using `ObjectId` and `ref`.

---

### Q25: What are Mongoose Indexes and why are they important?
**Answer:**
An **Index** is a data structure (b-tree) created on specific collection fields (e.g., `user` ID on `Transaction` schema). Without indexes, MongoDB must perform a full collection scan (reading every document) to find matching results. Indexes dramatically speed up `find()` queries as database size grows.

---

### Q26: Explain standard HTTP status codes used in REST APIs.
**Answer:**
- **200 OK**: Request succeeded.
- **201 Created**: Resource successfully created (`POST`).
- **400 Bad Request**: Invalid client input.
- **401 Unauthorized**: Missing or invalid authentication token.
- **403 Forbidden**: Authenticated, but user lacks permission.
- **404 Not Found**: Resource does not exist.
- **500 Internal Server Error**: Unexpected server failure.

---

### Q27: What is ReDoS (Regular Expression Denial of Service)?
**Answer:**
ReDoS occurs when a backend evaluates an unescaped, complex user-supplied string in a regular expression. Certain regex patterns exhibit exponential backtracking time, causing the CPU thread to lock up at 100% usage and crashing the server. Always escape regex inputs or use strict query filters.

---

### Q28: What is User Account Enumeration and how do you prevent it?
**Answer:**
Account Enumeration is a security flaw where an API reveals whether a user/email is registered in the system (e.g. returning "User does not exist" on login). Attackers use this to harvest valid target emails.

*Fix:* Always return generic auth failure messages: `"Invalid email or password"`.

---

### Q29: What flags should be configured on HTTP authentication cookies?
**Answer:**
1. **`httpOnly: true`**: Prevents client-side JS from reading cookie (mitigates XSS).
2. **`secure: true`**: Ensures cookie is sent only over HTTPS connections in production.
3. **`sameSite: 'strict'` or `'lax'`**: Protects against Cross-Site Request Forgery (CSRF).

---

### Q30: What is the MVC (Model-View-Controller) pattern and why use it?
**Answer:**
MVC is an architectural design pattern:
- **Model**: Manages data schema and database interactions (`models/Transaction.js`).
- **View**: User interface (in REST APIs, JSON responses).
- **Controller**: Contains business logic, processes inputs, and calls Models (`controllers/transactionController.js`).

Separating MVC responsibilities ensures modularity, testability, reusability, and clean separation of concerns.
