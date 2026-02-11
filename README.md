# Rental System Backend - MVC Architecture

Backend API for the Rental Management System built with Express.js and MySQL.

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MySQL connection configuration
├── controllers/              # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── equipmentController.js
│   ├── customerController.js
│   ├── orderController.js
│   ├── expenseController.js
│   ├── categoryController.js
│   └── settingController.js
├── models/                   # Data access layer
│   ├── User.js
│   ├── Equipment.js
│   ├── Customer.js
│   ├── Order.js
│   ├── Expense.js
│   ├── Category.js
│   └── Setting.js
├── routes/                   # API route definitions
│   ├── auth.js
│   ├── users.js
│   ├── equipment.js
│   ├── customers.js
│   ├── orders.js
│   ├── expenses.js
│   ├── categories.js
│   └── settings.js
├── middleware/               # Custom middleware
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Global error handling
├── utils/
│   └── initDB.js            # Database initialization
├── database/
│   └── schema.sql           # Database schema reference
├── .env.example             # Environment variables template
├── server.js                # Application entry point
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rental_system
PORT=5000
JWT_SECRET=your_secret_key_here
```

### 3. Setup MySQL Database

Make sure MySQL is running, then the server will automatically:
- Create the database if it doesn't exist
- Create all required tables
- Insert default admin user

### 4. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🔑 Default Login Credentials

- **Username:** `admin`
- **Password:** `(Check create-admin.js or ask administrator)`

> ⚠️ Change these credentials in production!

## 📡 API Endpoints

### Authentication (Public)
- `POST /api/login` - User login

### Users (Protected, Admin only for some)
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

### Equipment (Protected)
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Customers (Protected)
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders (Protected)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Expenses (Protected)
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories (Protected)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Settings (Protected, Save is admin only)
- `GET /api/settings` - Get settings
- `POST /api/settings` - Save settings (admin)

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

1. Login to get a token:
```bash
POST /api/login
{
  "username": "admin",
  "password": "your_password"
}
```

2. Use the token in subsequent requests:
```bash
Authorization: Bearer <your_token_here>
```

## 🛠️ Technologies

- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression
- **Rate Limiting** - Prevent brute force attacks

## 📝 Notes

- The server automatically initializes the database on first run
- Rate limiting is enabled for login (20 attempts per 15 minutes)
- All passwords are hashed with bcrypt
- JWT tokens expire after 24 hours
