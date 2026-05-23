# 🚀 ENERGEIA BACKEND - QUICK START GUIDE

## ⚡ Installation & Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup MongoDB
**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition or Docker
# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster and get connection string
4. Update `.env` with your connection string

### Step 3: Configure Environment
The `.env` file is already created with default values:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/energeia
PORT=5000
NODE_ENV=development
JWT_SECRET=energeia_jwt_secret_key_change_in_production_2024
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

Change values as needed.

### Step 4: Start Server
**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

✅ Server running on: **http://localhost:5000**
✅ Health Check: **http://localhost:5000/health**

---

## 📡 Testing APIs

### Using Postman/Insomnia

**Base URL:** `http://localhost:5000/api/v1`

### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "9876543210",
  "password": "password123",
  "role": "user"
}
```

### 2. Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Profile (Protected)
```
GET /auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🏗️ Backend Architecture

```
✅ MODULAR ARCHITECTURE - Each module is completely independent

backend/
│
├── config/db.js                    # MongoDB connection
├── middleware/                     # Middleware functions
│   ├── authMiddleware.js          # JWT verification
│   ├── errorMiddleware.js         # Error handling
│   └── uploadMiddleware.js        # File uploads
│
├── modules/                        # 8 Independent Modules
│   ├── auth/                       # Authentication (Register, Login, Profile)
│   ├── fleet/                      # Fleet Management
│   ├── dealership/                 # Dealership & Franchise
│   ├── ev-showroom/                # EV Vehicle Showroom
│   ├── charging/                   # EV Charging Stations
│   ├── service-center/             # Service Booking & Management
│   ├── payments/                   # Payment Processing
│   └── reports/                    # Analytics & Reports
│
└── uploads/                        # File storage directory
```

### Each Module Has:
- `model.js` - Database schema (Mongoose)
- `service.js` - Business logic
- `controller.js` - Request handlers
- `routes.js` - API endpoints

---

## 🔐 Module Replacement Guide

**This is the key feature - you can easily replace any module's API later!**

### Example: Replace Fleet Module with External API

1. **Keep the route prefix unchanged:** `/api/v1/fleet`

2. **Update `fleet.routes.js`** to call external API instead:
   ```javascript
   // Before: Calling local service
   router.post('/register', fleetController.registerFleet);
   
   // After: Calling external API
   router.post('/register', async (req, res, next) => {
     try {
       const response = await fetch('https://external-api.com/fleet/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(req.body)
       });
       res.json(await response.json());
     } catch (error) {
       next(error);
     }
   });
   ```

3. **No other modules are affected** ✅
4. **Frontend code remains the same** ✅

---

## 📊 Database Schema Overview

### Auth Collection (Users)
```javascript
{
  fullName, email, phoneNumber, password (hashed),
  role (user/fleet-manager/dealer/admin),
  isVerified, isActive, profileImage,
  address, city, state, pincode,
  timestamps
}
```

### Fleet Collection
```javascript
{
  fleetManagerId (ref: Auth),
  companyName, registrationNumber, gstNumber,
  totalVehicles, totalDrivers,
  registrationDoc, gstDoc,
  isVerified, status (pending/approved/rejected),
  timestamps
}
```

### Similar schemas for:
- Dealership, Showroom, ChargingStation, Service, Payment, Report

---

## 🔗 Frontend Integration

### Update Frontend API Base URL

**services/authApi.ts**
```typescript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const loginUser = (email, password) => {
  return fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());
};

export const getProfile = (token) => {
  return fetch(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());
};
```

**Store JWT Token in Frontend**
```typescript
// After login
localStorage.setItem('authToken', response.data.token);
localStorage.setItem('userId', response.data.userId);

// For subsequent requests
const token = localStorage.getItem('authToken');
const headers = { Authorization: `Bearer ${token}` };
```

---

## 🧪 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": "Stack trace (development only)"
}
```

---

## 📝 Common API Errors

| Status | Code | Solution |
|--------|------|----------|
| 400 | MISSING_FIELDS | Check required fields in request body |
| 401 | INVALID_TOKEN | Login again and get fresh token |
| 401 | NO_TOKEN | Add Authorization header with JWT |
| 404 | USER_NOT_FOUND | Verify user ID exists |
| 500 | INTERNAL_SERVER_ERROR | Check server logs |

---

## 📤 File Upload Example

```bash
POST /api/v1/fleet/register
Headers:
  - Authorization: Bearer YOUR_JWT_TOKEN
  - Content-Type: multipart/form-data

Form Data:
  - companyName: "My Fleet Co"
  - registrationNumber: "REG123"
  - gstNumber: "GST456"
  - registrationDoc: [file]
  - gstDoc: [file]
```

---

## 🔐 JWT Token Example

**JWT Structure:** `header.payload.signature`

**Decoded Payload:**
```json
{
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "email": "john@example.com",
  "role": "user",
  "iat": 1701234567,
  "exp": 1701839367
}
```

**Token expires after:** 7 days (configurable in `.env`)

---

## 🚨 Troubleshooting

### Issue: MongoDB Connection Failed
```
✓ Ensure MongoDB is running: mongod
✓ Check MONGODB_URI in .env
✓ Open MongoDB Compass and verify connection
```

### Issue: JWT Token Invalid
```
✓ Check token is not expired
✓ Verify JWT_SECRET matches in .env
✓ Ensure Authorization header format: "Bearer YOUR_TOKEN"
```

### Issue: Port Already in Use
```
✓ Change PORT in .env to 5001, 5002, etc.
✓ Or kill existing process on port 5000
```

### Issue: CORS Error
```
✓ Update CORS_ORIGIN in .env
✓ Current: http://localhost:3000
✓ Change if frontend runs on different port
```

---

## 📚 Additional Resources

- **MongoDB Compass:** https://www.mongodb.com/products/compass
- **Postman:** https://www.postman.com/
- **JWT Decoder:** https://jwt.io/
- **Express Docs:** https://expressjs.com/
- **Mongoose Docs:** https://mongoosejs.com/

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `npm install` completed without errors
- [ ] `.env` file configured with MongoDB URI
- [ ] MongoDB is running (mongod)
- [ ] `npm run dev` starts server successfully
- [ ] Health check works: http://localhost:5000/health
- [ ] Can register user at `/api/v1/auth/register`
- [ ] Can login at `/api/v1/auth/login`
- [ ] JWT token received after login
- [ ] Can access protected route with token
- [ ] MongoDB Compass shows data in collections

---

## 🎯 Next Steps

1. **Test all API endpoints** with Postman
2. **Connect frontend** to backend APIs
3. **Implement UI** for each module
4. **Add validation** if needed
5. **Deploy** to production server

---

**Backend Setup Complete! 🎉**

For detailed API documentation, see `README.md`
