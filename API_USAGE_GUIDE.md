# Panduan CRUD API EduPangan

Panduan lengkap cara melakukan CRUD (Create, Read, Update, Delete) menggunakan API backend.

---

## 📦 Cara 1: Menggunakan Hook `useApi` (Disarankan)

Hook ini menyediakan loading dan error states otomatis.

### Contoh Penggunaan:

```javascript
'use client';

import { useApi } from '../hooks/useApi';

export default function ExampleComponent() {
  const { get, post, put, delete: del, loading, error } = useApi('/api');

  // READ - Get data
  const fetchData = async () => {
    try {
      // Get all users
      const users = await get('/users');

      // Get with query params
      const garden = await get('/garden', { userId: 1, type: 'plants' });

      console.log('Users:', users);
      console.log('Garden:', garden);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // CREATE - Add new data
  const createUser = async () => {
    try {
      const newUser = await post('/users', {
        fullName: 'Ibu Siti Aminah',
        phoneNumber: '081234567890',
        rw: '02',
        kaderCode: 'PKK2025',
        pin: '1234',
        confirmPin: '1234',
      });
      console.log('User created:', newUser);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // CREATE - Add plant
  const addPlant = async () => {
    try {
      const plant = await post('/garden', {
        type: 'plant',
        userId: 1,
        data: {
          name: 'Kangkung',
          quantity: 20,
          growthPeriod: '25-30 hari',
          category: 'Sayuran Hijau',
        },
      });
      console.log('Plant added:', plant);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // UPDATE - Update data
  const updatePlant = async (plantId) => {
    try {
      const updated = await put('/garden', {
        plantId: plantId,
        updates: {
          status: 'siap_panen',
        },
      });
      console.log('Plant updated:', updated);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // UPDATE - Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      await put('/notifications', {
        notificationId: notificationId,
        markAll: false,
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // DELETE - Remove data
  const deletePlant = async (plantId) => {
    try {
      await del('/garden?type=plant&id=' + plantId);
      console.log('Plant deleted');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <button onClick={fetchData}>Get Data</button>
      <button onClick={createUser}>Create User</button>
      <button onClick={addPlant}>Add Plant</button>
      <button onClick={() => updatePlant(123)}>Update Plant</button>
      <button onClick={() => deletePlant(123)}>Delete Plant</button>
    </div>
  );
}
```

---

## 📦 Cara 2: Menggunakan Fetch Langsung

```javascript
'use client';

import { useState } from 'react';

export default function ExampleComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // READ
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const createData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Ibu Siti Aminah',
          phoneNumber: '081234567890',
          rw: '02',
        }),
      });
      const result = await response.json();
      console.log('Created:', result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <button onClick={fetchData}>Get Users</button>
      <button onClick={createData}>Create User</button>
    </div>
  );
}
```

---

## 📦 Cara 3: Menggunakan Server Component (Server-side Rendering)

```javascript
import { vegetables } from '../../data/staticData';

export default async function ServerExample() {
  // Fetch data on server
  const users = await fetch('http://localhost:3000/api/users').then(r => r.json());
  const garden = await fetch('http://localhost:3000/api/garden').then(r => r.json());

  return (
    <div>
      <h1>Users: {users.length}</h1>
      <h1>Plants: {garden.plants.length}</h1>
    </div>
  );
}
```

---

## 📝 Contoh CRUD Lengkap untuk Setiap API

### 1. Users API

```javascript
// READ - Get all users
const users = await get('/users');

// READ - Filter by RW
const usersRw02 = await get('/users', { rw: '02' });

// READ - Filter by role
const kadres = await get('/users', { role: 'kader' });

// CREATE - Register new user
const newUser = await post('/users', {
  fullName: 'Ibu Siti Aminah',
  phoneNumber: '081234567890',
  rw: '02',
  kaderCode: 'PKK2025',
  pin: '1234',
  confirmPin: '1234',
});
```

### 2. Garden API

```javascript
// READ - Get all garden data
const garden = await get('/garden');

// READ - Get specific user's plants
const plants = await get('/garden', { userId: 1, type: 'plants' });

// READ - Get activities
const activities = await get('/garden', { userId: 1, type: 'activities' });

// READ - Get harvests
const harvests = await get('/garden', { userId: 1, type: 'harvests' });

// CREATE - Add plant
const plant = await post('/garden', {
  type: 'plant',
  userId: 1,
  data: {
    name: 'Kangkung',
    quantity: 20,
    growthPeriod: '25-30 hari',
    category: 'Sayuran Hijau',
  },
});

// CREATE - Add activity
const activity = await post('/garden', {
  type: 'activity',
  userId: 1,
  data: {
    type: 'tanam',
    plantName: 'Kangkung',
    quantity: 20,
    status: 'tumbuh',
  },
});

// CREATE - Record harvest
const harvest = await post('/garden', {
  type: 'harvest',
  userId: 1,
  data: {
    plantType: 'Kangkung',
    plantName: 'Kangkung',
    quantity: 2.5,
    unit: 'kg',
    harvestDate: '2025-01-15',
  },
});

// UPDATE - Update plant status
const updated = await put('/garden', {
  plantId: 123,
  updates: {
    status: 'siap_panen',
  },
});

// DELETE - Remove plant
await del('/garden?type=plant&id=123');

// DELETE - Remove activity
await del('/garden?type=activity&id=456');

// DELETE - Remove harvest
await del('/garden?type=harvest&id=789');
```

### 3. Seeds API

```javascript
// READ - Get all seeds
const seeds = await get('/seeds');

// READ - Get stock only
const stock = await get('/seeds', { type: 'stock' });

// READ - Get transactions
const transactions = await get('/seeds', { type: 'transactions' });

// READ - Get user's transactions
const userTransactions = await get('/seeds', { type: 'transactions', userId: 1 });

// CREATE - Order seeds
const order = await post('/seeds', {
  type: 'order',
  userId: 1,
  vegetableId: 1,
  vegetableName: 'Kangkungkt',
  quantity: 20,
});

// CREATE - Return seeds (2x contribution)
const returnSeed = await post('/seeds', {
  type: 'return',
  userId: 1,
  vegetableId: 2,
  vegetableName: 'Bayam',
  quantity: 50,
});
```

### 4. Notifications API

```javascript
// READ - Get all notifications
const notifications = await get('/notifications');

// READ - Get user's notifications
const userNotifications = await get('/notifications', { userId: 1 });

// READ - Get unread only
const unread = await get('/notifications', { userId: 1, unread: 'true' });

// CREATE - Add notification
const notification = await post('/notifications', {
  type: 'harvest',
  title: 'Siap Panen!',
  message: 'Bayam Anda sudah siap dipanen',
  icon: '🌿',
  userId: 1,
});

// UPDATE - Mark as read
await put('/notifications', {
  notificationId: 123,
  markAll: false,
});

// UPDATE - Mark all as read
await put('/notifications', {
  markAll: true,
});

// DELETE - Remove notification
await del('/notifications?id=123');
```

---

## 🔌 Integrasi dengan Komponen Existing

### Update `BankBibit.jsx` untuk menggunakan API:

```javascript
'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { vegetables } from '../../data/staticData';

const BankBibit = ({ onNavigateBack, onOrder }) => {
  const [seeds, setSeeds] = useState(vegetables);
  const { get, post, loading, error } = useApi('/api');

  // Load seeds from API on mount
  useEffect(() => {
    loadSeeds();
  }, []);

  const loadSeeds = async () => {
    try {
      const data = await get('/seeds', { type: 'stock' });
      setSeeds(data);
    } catch (err) {
      console.error('Failed to load seeds:', err);
    }
  };

  const handleOrder = async (vegetable, quantity) => {
    try {
      const result = await post('/seeds', {
        type: 'order',
        userId: 1, // TODO: Get from auth
        vegetableId: vegetable.id,
        vegetableName: vegetable.name,
        quantity: quantity,
      });

      alert(`Berhasil memesan ${quantity} bibit ${vegetable.name}!`);
      onOrder && onOrder({ vegetable, quantity });
    } catch (err) {
      alert('Gagal memesan: ' + err.message);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* Render seeds */}
      {seeds.map(veg => (
        <button key={veg.id} onClick={() => handleOrder(veg, 1)}>
          {veg.name}
        </button>
      ))}
    </div>
  );
};
```

### Update `KebunSaya.jsx` untuk menggunakan API:

```javascript
'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';

const KebunSaya = ({ onNavigateBack, onNavigate }) => {
  const [plants, setPlants] = useState([]);
  const [activities, setActivities] = useState([]);
  const { get, post, put, del, loading } = useApi('/api');

  useEffect(() => {
    loadGardenData();
  }, []);

  const loadGardenData = async () => {
    try {
      const plantsData = await get('/garden', { userId: 1, type: 'plants' });
      const activitiesData = await get('/garden', { userId: 1, type: 'activities' });
      setPlants(plantsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Failed to load garden data:', err);
    }
  };

  const handleAddPlant = async (vegetable, quantity) => {
    try {
      const result = await post('/garden', {
        type: 'plant',
        userId: 1,
        data: {
          name: vegetable.name,
          quantity: quantity,
          growthPeriod: vegetable.growthPeriod,
          category: vegetable.category,
        },
      });

      // Reload data
      loadGardenData();
      alert('Tanaman berhasil ditambahkan!');
    } catch (err) {
      alert('Gagal menambahkan tanaman: ' + err.message);
    }
  };

  const handleMarkReady = async (plantId) => {
    try {
      await put('/garden', {
        plantId: plantId,
        updates: { status: 'siap_panen' },
      });
      loadGardenData();
    } catch (err) {
      alert('Gagal mengupdate status: ' + err.message);
    }
  };

  const handleDeletePlant = async (plantId) => {
    try {
      await del('/garden?type=plant&id=' + plantId);
      loadGardenData();
    } catch (err) {
      alert('Gagal menghapus tanaman: ' + err.message);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {/* Render plants */}
      {plants.map(plant => (
        <div key={plant.id}>
          <p>{plant.name}</p>
          <button onClick={() => handleMarkReady(plant.id)}>
            Mark Ready
          </button>
          <button onClick={() => handleDeletePlant(plant.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## 📋 Tips Best Practices

1. **Gunakan `useApi` hook** untuk loading dan error states otomatis
2. **Handle errors** dengan try-catch blocks
3. **Show loading indicators** saat fetching data
4. **Refresh data** setelah create/update/delete operations
5. **Gunakan userId dari auth** (bukan hardcoded)
6. **Validasi input** sebelum mengirim ke API

---

## 🚀 Next Steps

1. Implementasi Authentication (JWT/OAuth)
2. Ganti in-memory data dengan database (PostgreSQL/MongoDB)
3. Tambahkan rate limiting
4. Tambahkan input validation di server
5. Implementasi file upload untuk foto panen
