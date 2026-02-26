import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAuthUser } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    if (type === 'seeds' || type === 'stock') {
      const seeds = await prisma.seed.findMany({
        orderBy: { name: 'asc' },
      });
      return NextResponse.json(seeds);
    }

    if (type === 'transactions') {
      const where = userId ? { userId: parseInt(userId) } : {};
      const transactions = await prisma.seedTransaction.findMany({
        where,
        include: {
          seed: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });
      return NextResponse.json(transactions);
    }

    const seeds = await prisma.seed.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(seeds);
  } catch (error) {
    console.error('Seeds GET error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Belum login' }, { status: 401 });
    }

    const body = await request.json();
    const { type, userId, vegetableId, quantity, vegetableName } = body;

    const parsedUserId = parseInt(userId);
    const parsedVegetableId = parseInt(vegetableId);

    if (type === 'order') {
      const seed = await prisma.seed.findUnique({
        where: { id: parsedVegetableId },
      });

      if (!seed) {
        return NextResponse.json(
          { error: 'Bibit tidak ditemukan' },
          { status: 404 }
        );
      }

      if (seed.stockAvailable < quantity) {
        return NextResponse.json(
          { error: 'Stok tidak mencukupi' },
          { status: 400 }
        );
      }

      const contribution = seed.price * quantity;

      const [transaction] = await prisma.$transaction([
        prisma.seedTransaction.create({
          data: {
            userId: parsedUserId,
            seedId: parsedVegetableId,
            transactionType: 'ambil',
            quantity,
            contributionPaid: contribution,
            status: 'selesai',
          },
        }),
        prisma.seed.update({
          where: { id: parsedVegetableId },
          data: {
            stockAvailable: { decrement: quantity },
          },
        }),
      ]);

      return NextResponse.json(
        { message: 'Order successful', transaction },
        { status: 201 }
      );
    }

    if (type === 'return') {
      const seed = await prisma.seed.findUnique({
        where: { id: parsedVegetableId },
      });

      if (!seed) {
        return NextResponse.json(
          { error: 'Bibit tidak ditemukan' },
          { status: 404 }
        );
      }

      const contributionReceived = seed.price * quantity * 2;

      const [transaction] = await prisma.$transaction([
        prisma.seedTransaction.create({
          data: {
            userId: parsedUserId,
            seedId: parsedVegetableId,
            transactionType: 'kembalikan',
            quantity,
            contributionReceived,
            status: 'selesai',
          },
        }),
        prisma.seed.update({
          where: { id: parsedVegetableId },
          data: {
            stockAvailable: { increment: quantity },
          },
        }),
      ]);

      return NextResponse.json(
        { message: 'Return successful', transaction },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Seeds POST error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
