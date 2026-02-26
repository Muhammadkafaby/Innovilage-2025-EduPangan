import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';
import { z } from 'zod';

const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Nomor HP tidak valid'),
  pin: z.string().min(4).max(6, 'PIN harus 4-6 digit'),
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { phoneNumber, pin } = validation.data;

    const user = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Nomor HP atau PIN salah' },
        { status: 401 }
      );
    }

    const isValidPin = await bcrypt.compare(pin, user.pin);
    if (!isValidPin) {
      return NextResponse.json(
        { error: 'Nomor HP atau PIN salah' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      process.env.AUTH_SECRET,
      { expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const response = NextResponse.json(
      {
        message: 'Login berhasil',
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          rw: user.rw,
          role: user.role,
          deviceId: user.deviceId,
        }
      },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
