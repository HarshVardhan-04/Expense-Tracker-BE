# 💰 Expense Tracker Backend

A RESTful backend service for the **Expense Tracker** application built using **Node.js**, **Express.js**, and **MongoDB**. It provides secure authentication, transaction management, search functionality, and APIs for the frontend application.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Token)
- Cookie Parser
- CORS
- dotenv
- Nodemon

---

## ✨ Features

- 🔐 User Registration
- 🔑 User Login & Logout
- 🛡️ JWT Authentication
- 🍪 HTTP Only Cookie Authentication
- 💵 Add Income
- 💸 Add Expense
- 📋 Fetch User Transactions
- 🔍 Search Transactions
- 🗑️ Delete Transactions
- 📊 Dashboard Statistics
- 📈 Reports API
- ☁️ MongoDB Atlas Integration

---

## 📂 Folder Structure

```
Expense-Tracker-BE/
│
├── config/
│   └── db.js
│
│
├── middleware/
│
├── models/
│   ├── User.js
│   └── Transaction.js
│
├── routes/
│   ├── authRoute.js
│   ├── transactionRoute.js
│   ├── searchRoute.js
│   └── userRoute.js
│
├── .env
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Configuration Files

| File | Description |
|------|-------------|
| `server.js` | Application entry point |
| `config/db.js` | MongoDB database connection |
| `package.json` | Project dependencies and scripts |
| `.env` | Environment variables |
| `README.md` | Project documentation |

---

## 🌐 Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Replace the values with your own MongoDB Atlas connection string and JWT secret.

---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/HarshVardhan-04/Expense-Tracker-BE.git
```

### 2. Navigate to the project

```bash
cd Expense-Tracker-BE
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

The backend server will start on:

```
http://localhost:5000
```

---

## 🔗 Frontend Repository

The frontend application communicates with this backend through REST APIs.

Frontend Repository:

```
https://github.com/HarshVardhan-04/Expense-Tracker-FE
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| POST | `/api/logout` | Logout user |

---

### Transactions

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/add` | Add Income/Expense |
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/income` | Get all income |
| DELETE | `/api/delete/:id` | Delete transaction |

---

### Search

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/search/:key` | Search transactions |

---

### Dashboard

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/dashboard` | Dashboard statistics |

---

## 🔒 Authentication

The backend uses **JWT Authentication** with **HTTP-only Cookies** to secure user sessions.

Protected routes require a valid authentication token issued during login.

---

## 🗄️ Database

This project uses **MongoDB Atlas** as the cloud database.

Collections:

- Users
- Transactions

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm start` | Start production server |

---

## 🌿 Default Branch

The primary development branch is:

```
main
```

---

## 📌 Default Configuration

| Setting | Value |
|---------|-------|
| Backend Port | 5000 |
| Database | MongoDB Atlas |
| Authentication | JWT + HTTP Only Cookies |
| API Format | REST |

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

## 👨‍💻 Author

**Harsh Vardhan**

GitHub: https://github.com/HarshVardhan-04

---

## 📄 License

This project is intended for learning, portfolio, and educational purposes.