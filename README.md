# 🚗 Energeia Backend - EV Ecosystem API

A scalable, modular Node.js backend for the Energeia EV Ecosystem project. Built with Express.js, MongoDB, and Mongoose with complete JWT authentication, file upload support, and comprehensive error handling.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Module Structure](#module-structure)
- [Database Schema](#database-schema)

## ✨ Features

- ✅ **Modular Architecture** - Separate APIs for each module (Auth, Fleet, Dealership, EV Showroom, Charging, Service Center, Payments, Reports)
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **File Upload** - Multer integration for document/image uploads
- ✅ **MVC Pattern** - Clean separation of concerns (Models, Views, Controllers)
- ✅ **Error Handling** - Centralized error middleware with proper HTTP status codes
- ✅ **MongoDB Integration** - Mongoose ORM with MongoDB Compass support
- ✅ **CORS Enabled** - Cross-Origin Resource Sharing configured
- ✅ **Request Logging** - Automatic request logging middleware
- ✅ **Production Ready** - Graceful shutdown, proper error handling, validation

## 🏗️ Architecture

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── middleware/
│   ├── authMiddleware.js     # JWT verification middleware
│   ├── errorMiddleware.js    # Centralized error handling
│   └── uploadMiddleware.js   # Multer file upload configuration
├── modules/
│   ├── auth/                 # Authentication Module
│   ├── fleet/                # Fleet Management Module
│   ├── dealership/           # Dealership Module
│   ├── ev-showroom/          # EV Showroom Module
│   ├── charging/             # EV Charging Module
│   ├── service-center/       # Service Center Module
│   ├── payments/             # Payments Module
│   └── reports/              # Reports Module
├── uploads/                  # File uploads directory
├── .env                      # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
└── server.js                # Main server file
```

### 📦 Module Structure

Each module follows this structure:
```
module/
├── {module}.model.js       # Mongoose schema definition
├── {module}.service.js     # Business logic
├── {module}.controller.js  # Request handlers
└── {module}.routes.js      # Route definitions
```

**Benefits:**
- ✅ Easy to replace individual modules later
- ✅ Independent module API endpoints
- ✅ No tight coupling between modules
- ✅ Scalable and maintainable

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- Multer (File uploads)
- bcryptjs (Password hashing)
- cors
- dotenv
- nodemon (Development)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Steps

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** (already provided, update if needed):
```bash
cp .env.example .env
```

4. **Update `.env` with your configuration:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/energeia
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

## ⚙️ Configuration

### MongoDB Setup

1. **Install MongoDB Community Edition** or use MongoDB Atlas cloud

2. **Start MongoDB locally:**
```bash
mongod
```

3. **Open MongoDB Compass:**
- Connection string: `mongodb://127.0.0.1:27017/energeia`
- This will create the database automatically on first insert

### Environment Variables

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/energeia

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=energeia_jwt_secret_key_change_in_production_2024
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880    # 5MB
UPLOAD_PATH=./uploads

# API
API_VERSION=v1
```

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

**Server will start on:**
- 🌐 http://localhost:5000
- 📊 Health Check: http://localhost:5000/health

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### 🔐 Authentication Module (`/auth`)
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login user
GET    /api/v1/auth/profile           # Get user profile (Protected)
PUT    /api/v1/auth/profile           # Update profile (Protected)
```

### 🚚 Fleet Management Module (`/fleet`)
```
POST   /api/v1/fleet/register         # Register fleet (Protected)
GET    /api/v1/fleet/details          # Get fleet details (Protected)
GET    /api/v1/fleet                  # Get all fleets (Protected)
PUT    /api/v1/fleet/update           # Update fleet (Protected)
PUT    /api/v1/fleet/verify/:id       # Verify fleet (Protected)
```

### 🏪 Dealership Module (`/dealership`)
```
POST   /api/v1/dealership/apply       # Apply for dealership (Protected)
GET    /api/v1/dealership/details     # Get dealership details (Protected)
GET    /api/v1/dealership/dashboard   # Get dashboard (Protected)
PUT    /api/v1/dealership/update      # Update dealership (Protected)
GET    /api/v1/dealership             # Get all dealerships (Protected)
```

### 🚗 EV Showroom Module (`/showroom`)
```
POST   /api/v1/showroom/add-vehicle   # Add vehicle (Protected)
GET    /api/v1/showroom/vehicles      # Get all vehicles
GET    /api/v1/showroom/vehicle/:id   # Get vehicle details
PUT    /api/v1/showroom/vehicle/:id   # Update vehicle (Protected)
DELETE /api/v1/showroom/vehicle/:id   # Delete vehicle (Protected)
```

### ⚡ EV Charging Module (`/charging`)
```
POST   /api/v1/charging/add-station   # Add charging station (Protected)
GET    /api/v1/charging/stations      # Get all stations
GET    /api/v1/charging/station/:id   # Get station details
POST   /api/v1/charging/book-slot     # Book charging slot (Protected)
PUT    /api/v1/charging/station/:id   # Update station (Protected)
```

### 🔧 Service Center Module (`/service`)
```
POST   /api/v1/service/book           # Book service (Protected)
GET    /api/v1/service/history        # Get service history (Protected)
GET    /api/v1/service/:id            # Get service details (Protected)
PUT    /api/v1/service/:id/status     # Update service status (Protected)
PUT    /api/v1/service/:id/complete   # Complete service (Protected)
GET    /api/v1/service                # Get all services (Protected)
```

### 💳 Payments Module (`/payments`)
```
POST   /api/v1/payments/create        # Create payment (Protected)
POST   /api/v1/payments/verify/:txnId # Verify payment (Protected)
GET    /api/v1/payments/history       # Get payment history (Protected)
GET    /api/v1/payments/:id           # Get payment details (Protected)
GET    /api/v1/payments/report        # Get transactions report (Protected)
```

### 📊 Reports Module (`/reports`)
```
GET    /api/v1/reports/fleet          # Generate fleet report (Protected)
GET    /api/v1/reports/revenue        # Generate revenue report (Protected)
GET    /api/v1/reports/service        # Generate service report (Protected)
GET    /api/v1/reports                # Get all reports (Protected)
GET    /api/v1/reports/:id            # Get report details (Protected)
PUT    /api/v1/reports/:id/status     # Update report status (Protected)
```

## 📝 Database Schema

### Collections Created

1. **Auth** - User accounts with authentication
2. **Fleet** - Fleet management data
3. **Dealership** - Dealership/Franchise information
4. **Showroom** - EV vehicle listings
5. **ChargingStation** - Charging station details
6. **Service** - Service bookings and history
7. **Payment** - Payment transactions
8. **Report** - Generated reports

## 🔐 Authentication

### Login Flow

1. **Register User**
   ```bash
   POST /api/v1/auth/register
   {
     "fullName": "John Doe",
     "email": "john@example.com",
     "phoneNumber": "9876543210",
     "password": "password123",
     "role": "user"
   }
   ```

2. **Login**
   ```bash
   POST /api/v1/auth/login
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Response (JWT Token)**
   ```json
   {
     "success": true,
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "userId": "64a1b2c3d4e5f6g7h8i9j0k1"
     }
   }
   ```

4. **Use Token in Requests**
   ```bash
   Header: Authorization: Bearer <token>
   ```

## 📤 File Upload

Supported file types:
- Images: JPG, PNG, GIF, WebP
- Documents: PDF

Maximum file size: 5MB

**Upload Locations:**
- Aadhaar: `/uploads/aadhaar/`
- PAN: `/uploads/pan/`
- RC: `/uploads/rc/`
- Vehicle Images: `/uploads/vehicles/`
- Driver Documents: `/uploads/drivers/`

## 🚨 Error Handling

All errors are returned in standardized format:

```json
{
  "success": false,
  "message": "User not found",
  "code": "USER_NOT_FOUND"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🔄 Module Replacement Guide

Since each module is completely independent, you can easily replace any module's API:

### Example: Replace Fleet Module

1. **Keep the route prefix:** `/api/v1/fleet`
2. **Keep the controller structure** with same method names
3. **Update `fleet.routes.js`** if endpoints change
4. **Import the new routes** in `server.js`

No changes needed in other modules!

## 📚 Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## 🔗 Connecting Frontend

Update your frontend API endpoints:

```typescript
// services/authApi.ts
const API_BASE = "http://localhost:5000/api/v1";

export const loginUser = (credentials) => {
  return fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
};
```

## 📋 Testing with Postman

1. Import the API collection
2. Set base URL: `http://localhost:5000/api/v1`
3. For protected routes, add token:
   - Tab: "Headers"
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## 📄 License

ISC License - See package.json

## 👨‍💻 Team

Energeia Development Team

## 🆘 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB Compass can connect

### JWT Errors
- Update JWT_SECRET in `.env`
- Check token format: `Bearer <token>`
- Verify token expiry

### File Upload Issues
- Check uploads/ directory exists
- Verify file size < 5MB
- Ensure supported file type

## 📞 Support

For issues or questions, contact: dev@energeia.com

---

**Made with ❤️ for the EV Ecosystem**
"# evcharging-backend" 
