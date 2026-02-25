import { NextResponse } from 'next/server';

// Simulated database (in production, use real database)
let users = [
  {
    id: 1,
    name: 'Ibu Siti Aminah',
    phone: '081234567890',
    rw: '02',
    role: 'peserta',
    joinDate: '2025-01-01',
    gardenSize: '15m²',
    totalHarvest: 45.5,
    activePlants: 12,
  },
  {
    id: 2,
    name: 'Ibu Nurhasanah',
    phone: '081234567891',
    rw: '02',
    role: 'peserta',
    joinDate: '2025-01-02',
    gardenSize: '20m²',
    totalHarvest: 38.2,
    activePlants: 15,
  },
  {
    id: 3,
    name: 'Ibu Aisyah',
    phone: '081234567892',
    rw: '03',
    role: 'kader',
    joinDate: '2024-12-15',
    gardenSize: '25m²',
    totalHarvest: 67.8,
    activePlants: 18,
  },
];

// GET all users
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rw = searchParams.get('rw');
  const role = searchParams.get('role');

  let filteredUsers = users;

  if (rw) {
    filteredUsers = filteredUsers.filter(user => user.rw === rw);
  }

  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  return NextResponse.json(filteredUsers);
}

// POST - Create new user
export async function POST(request) {
  const body = await request.json();

  const newUser = {
    id: users.length + 1,
    name: body.fullName,
    phone: body.phoneNumber,
    rw: body.rw,
    role: 'peserta',
    joinDate: new Date().toISOString().split('T')[0],
    gardenSize: '0m²',
    totalHarvest: 0,
    activePlants: 0,
  };

  users.push(newUser);

  return NextResponse.json(
    { message: 'User created successfully', user: newUser },
    { status: 201 }
  );
}
