import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nama minimal 3 karakter'),
  phoneNumber: z.string().min(10, 'Nomor HP tidak valid'),
  rw: z.string().min(1, 'Pilih RW'),
  kaderCode: z.string().min(4, 'Kode kader tidak valid'),
  pin: z.string().min(4).max(6, 'PIN harus 4-6 digit'),
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { fullName, phoneNumber, rw, kaderCode, pin } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Nomor HP sudah terdaftar' },
        { status: 400 }
      );
    }

    const hashedPin = await bcrypt.hash(pin, 12);

    const user = await prisma.user.create({
      data: {
        name: fullName,
        phone: phoneNumber,
        rw,
        kaderCode,
        pin: hashedPin,
        role: 'peserta',
        gardenSize: '0m²',
      },
    });

    return NextResponse.json(
      { 
        message: 'Pendaftaran berhasil',
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
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
