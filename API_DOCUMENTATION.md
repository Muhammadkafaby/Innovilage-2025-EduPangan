# EduPangan API Documentation

Backend API untuk aplikasi EduPangan menggunakan Next.js App Router.

## Base URL
```
http://localhost:3000/api
```

---

## 📊 Users API

### Get All Users
```http
GET /api/users
```

**Query Parameters:**
- `rw` (optional) - Filter by RW
- `role` (optional) - Filter by role (peserta, kader)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Ibu Siti Aminah",
    "phone": "081234567890",
    "rw": "02",
    "role": "peserta",
    "joinDate": "2025-01-01",
    "gardenSize": "15m²",
    "totalHarvest": 45.5,
    "activePlants": 12
  }
]
```

### Create New User
```http
POST /api/users
```

**Request Body:**
```json
{
  "fullName": "Ibu Siti Aminah",
  "phoneNumber": "081234567890",
  "rw": "02",
  "kaderCode": "PKK2025",
  "pin": "1234",
  "confirmPin": "1234"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": { ... }
}
```

---

## 🌱 Garden API

### Get Garden Data
```http
GET /api/garden
```

**Query Parameters:**
- `userId` (optional) - Filter by user ID
- `type` (optional) - Return specific data type (plants, activities, harvests)

**Response:**
```json
{
  "plants": [...],
  "activities": [...],
  "harvests": [...]
}
```

### Add Plant/Activity/Harvest
```http
POST /api/garden
```

**Request Body:**
```json
{
  "type": "plant",  // or "activity", "harvest"
  "userId": 1,
  "data": {
    "name": "Kangkung",
    "quantity": 20,
    "growthPeriod": "25-30 hari",
    "category": "Sayuran Hijau"
  }
}
```

**Response:**
```json
{
  "message": "Plant added",
  "plant": { ... }
}
```

### Update Plant Status
```http
PUT /api/garden
```

**Request Body:**
```json
{
  "plantId": 123,
  "updates": {
    "status": "siap_panen"
  }
}
```

### Delete Plant/Activity/Harvest
```http
DELETE /api/garden?type=plant&id=123
```

---

## 🌾 Seeds API

### Get Seeds
```http
GET /api/seeds
```

**Query Parameters:**
- `type` (optional) - "seeds", "transactions", "stock"
- `userId` (optional) - Filter transactions by user ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kangkung",
    "category": "Sayuran Hijau",
    "stockAvailable": 150,
    "price": 500
  }
]
```

### Order Seeds
```http
POST /api/seeds
```

**Request Body:**
```json
{
  "type": "order",  // or "return"
  "userId": 1,
  "vegetableId": 1,
  "vegetableName": "Kangkung",
  "quantity": 20
}
```

**Response:**
```json
{
  "message": "Order successful",
  "transaction": {
    "id": 123,
    "transactionType": "ambil",
    "contributionPaid": 10000,
    "status": "selesai"
  }
}
```

---

## 🔔 Notifications API

### Get Notifications
```http
GET /api/notifications
```

**Query Parameters:**
- `userId` (optional) - Filter by user ID
- `unread` (optional) - "true" to get only unread

**Response:**
```json
[
  {
    "id": 1,
    "type": "reminder",
    "title": "Waktunya Menyiram!",
    "message": "Kangkung dan Bayam Anda perlu disiram pagi ini",
    "date": "2025-01-12 06:00",
    "read": false,
    "icon": "💧"
  }
]
```

### Create Notification
```http
POST /api/notifications
```

**Request Body:**
```json
{
  "type": "harvest",
  "title": "Siap Panen!",
  "message": "Bayam Anda sudah siap dipanen",
  "icon": "🌿",
  "userId": 1
}
```

### Mark as Read
```http
PUT /api/notifications
```

**Request Body:**
```json
{
  "notificationId": 1,
  "markAll": false  // or true to mark all as read
}
```

### Delete Notification
```http
DELETE /api/notifications?id=1
```

---

## 📝 Usage Examples

### Fetch with JavaScript (Client-side)
```javascript
// Get all users
const response = await fetch('/api/users');
const users = await response.json();

// Get garden data for user
const gardenResponse = await fetch('/api/garden?userId=1');
const gardenData = await gardenResponse.json();

// Add new plant
const plantResponse = await fetch('/api/garden', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'plant',
    userId: 1,
    data: {
      name: 'Kangkung',
      quantity: 20,
      growthPeriod: '25-30 hari',
      category: 'Sayuran Hijau'
    }
  })
});
```

### Fetch with Server Component
```javascript
import { vegetables } from '../../data/staticData';

export async function MyComponent() {
  const users = await fetch('http://localhost:3000/api/users').then(r => r.json());
  const garden = await fetch('http://localhost:3000/api/garden?userId=1').then(r => r.json());

  return <div>{/* render data */}</div>;
}
```

---

## 🔒 Notes

- Data currently stored in memory (will reset on server restart)
- In production, replace with real database (PostgreSQL, MongoDB, etc.)
- User authentication not implemented yet
- Rate limiting not implemented yet
