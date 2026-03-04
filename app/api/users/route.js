import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAuthUser, requireAdmin } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rw = searchParams.get('rw');
    const role = searchParams.get('role');

    const where = {};
    if (rw) where.rw = rw;
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        rw: true,
        role: true,
        kaderCode: true,
        gardenSize: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [plants, harvests, activities] = await Promise.all([
          prisma.plant.count({ where: { userId: user.id, status: 'tumbuh' } }),
          prisma.harvest.aggregate({ where: { userId: user.id }, _sum: { quantity: true } }),
          prisma.activity.count({ where: { userId: user.id } }),
        ]);

        return {
          ...user,
          activePlants: plants,
          totalHarvest: harvests._sum.quantity || 0,
          totalActivities: activities,
          joinDate: user.createdAt.toISOString().split('T')[0],
        };
      })
    );

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin()(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { fullName, phoneNumber, rw, role } = body;

    const existingUser = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Nomor HP sudah terdaftar' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: fullName,
        phone: phoneNumber,
        rw,
        role: role || 'peserta',
        pin: '$2a$12$dummyhashfordemo', 
        gardenSize: '0m²',
      },
    });

    return NextResponse.json(
      { 
        message: 'User berhasil dibuat', 
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          rw: user.rw,
          role: user.role,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Users POST error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
