import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Belum login' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        rw: true,
        role: true,
        kaderCode: true,
        gardenSize: true,
        createdAt: true,
        mqttDevice: {
          select: {
            deviceId: true,
            deviceNumber: true,
            username: true,
            password: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        ...user,
        deviceId: user.mqttDevice?.deviceId || null,
        deviceNumber: user.mqttDevice?.deviceNumber || null,
        username: user.mqttDevice?.username || null,
        password: user.mqttDevice?.password || null,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json(
      { error: 'Token tidak valid' },
      { status: 401 }
    );
  }
}
