import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAuthUser } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');
    const includeArchived = searchParams.get('includeArchived') === 'true';

    const seedWhere = includeArchived ? {} : { isActive: true };

    if (type === 'seeds' || type === 'stock') {
      const seeds = await prisma.seed.findMany({
        where: seedWhere,
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

    if (type === 'stock-logs') {
      const auth = await getAuthUser(request);
      if (!auth) {
        return NextResponse.json({ error: 'Belum login' }, { status: 401 });
      }
      if (auth.role !== 'admin' && auth.role !== 'kader') {
        return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
      }

      const seedId = searchParams.get('seedId');
      const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100);

      const logs = await prisma.stockUpdateLog.findMany({
        where: seedId ? { seedId: parseInt(seedId, 10) } : {},
        include: {
          user: { select: { id: true, name: true, role: true } },
          seed: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: Number.isNaN(limit) ? 30 : limit,
      });

      return NextResponse.json(logs);
    }

    const seeds = await prisma.seed.findMany({
      where: seedWhere,
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

    if (type === 'create-seed') {
      if (auth.role !== 'admin' && auth.role !== 'kader') {
        return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
      }

      const name = String(body.name || '').trim();
      const category = String(body.category || '').trim();
      const stockAvailable = parseInt(body.stockAvailable, 10);
      const price = parseInt(body.price, 10);

      if (!name || !category) {
        return NextResponse.json(
          { error: 'Nama dan kategori bibit wajib diisi' },
          { status: 400 }
        );
      }

      if (Number.isNaN(stockAvailable) || stockAvailable < 0) {
        return NextResponse.json(
          { error: 'Stok bibit harus angka >= 0' },
          { status: 400 }
        );
      }

      if (Number.isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: 'Harga bibit harus angka >= 0' },
          { status: 400 }
        );
      }

      const seed = await prisma.seed.create({
        data: {
          name,
          scientificName: String(body.scientificName || '').trim() || null,
          category,
          stockAvailable,
          unit: String(body.unit || 'bibit').trim() || 'bibit',
          growthPeriod: String(body.growthPeriod || '').trim() || null,
          waterNeeds: String(body.waterNeeds || '').trim() || null,
          difficulty: String(body.difficulty || '').trim() || null,
          price,
          tips: String(body.tips || '').trim() || null,
        },
      });

      await prisma.stockUpdateLog.create({
        data: {
          seedId: seed.id,
          userId: auth.id,
          oldStock: null,
          newStock: seed.stockAvailable,
          oldPrice: null,
          newPrice: seed.price,
          note: `Tambah jenis bibit baru: ${seed.name}`,
        },
      });

      return NextResponse.json(
        { message: 'Jenis bibit baru berhasil ditambahkan', seed },
        { status: 201 }
      );
    }

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

      if (!seed.isActive) {
        return NextResponse.json(
          { error: 'Bibit sudah diarsipkan dan tidak bisa dipesan' },
          { status: 400 }
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

      if (!seed.isActive) {
        return NextResponse.json(
          { error: 'Bibit sudah diarsipkan dan tidak bisa diproses' },
          { status: 400 }
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

export async function PUT(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Belum login' }, { status: 401 });
    }

    if (auth.role !== 'admin' && auth.role !== 'kader') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const body = await request.json();
    const { seedId, stockAvailable, price, category, growthPeriod, waterNeeds, difficulty, tips } = body;

    if (!seedId) {
      return NextResponse.json({ error: 'seedId wajib diisi' }, { status: 400 });
    }

    const updateData = {};

    if (stockAvailable !== undefined) {
      const value = parseInt(stockAvailable, 10);
      if (Number.isNaN(value) || value < 0) {
        return NextResponse.json({ error: 'Stok harus angka >= 0' }, { status: 400 });
      }
      updateData.stockAvailable = value;
    }

    if (price !== undefined) {
      const value = parseInt(price, 10);
      if (Number.isNaN(value) || value < 0) {
        return NextResponse.json({ error: 'Harga harus angka >= 0' }, { status: 400 });
      }
      updateData.price = value;
    }

    if (category !== undefined) updateData.category = String(category || '').trim();
    if (growthPeriod !== undefined) updateData.growthPeriod = String(growthPeriod || '').trim();
    if (waterNeeds !== undefined) updateData.waterNeeds = String(waterNeeds || '').trim();
    if (difficulty !== undefined) updateData.difficulty = String(difficulty || '').trim();
    if (tips !== undefined) updateData.tips = String(tips || '').trim();

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang diperbarui' }, { status: 400 });
    }

    const existingSeed = await prisma.seed.findUnique({
      where: { id: parseInt(seedId, 10) },
      select: { id: true, name: true, stockAvailable: true, price: true },
    });

    if (!existingSeed) {
      return NextResponse.json({ error: 'Bibit tidak ditemukan' }, { status: 404 });
    }

    const [updatedSeed] = await prisma.$transaction([
      prisma.seed.update({
        where: { id: parseInt(seedId, 10) },
        data: updateData,
      }),
      prisma.stockUpdateLog.create({
        data: {
          seedId: existingSeed.id,
          userId: auth.id,
          oldStock: existingSeed.stockAvailable,
          newStock: updateData.stockAvailable ?? existingSeed.stockAvailable,
          oldPrice: existingSeed.price,
          newPrice: updateData.price ?? existingSeed.price,
          note: `Update stok bibit ${existingSeed.name}`,
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Data bibit berhasil diperbarui',
      seed: updatedSeed,
    });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Bibit tidak ditemukan' }, { status: 404 });
    }

    console.error('Seeds PUT error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Belum login' }, { status: 401 });
    }

    if (auth.role !== 'admin' && auth.role !== 'kader') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const seedId = parseInt(searchParams.get('seedId') || '', 10);

    if (Number.isNaN(seedId)) {
      return NextResponse.json({ error: 'seedId tidak valid' }, { status: 400 });
    }

    const seed = await prisma.seed.findUnique({
      where: { id: seedId },
      select: { id: true, name: true, stockAvailable: true, price: true },
    });

    if (!seed) {
      return NextResponse.json({ error: 'Bibit tidak ditemukan' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.stockUpdateLog.create({
        data: {
          seedId: seed.id,
          userId: auth.id,
          oldStock: seed.stockAvailable,
          newStock: 0,
          oldPrice: seed.price,
          newPrice: 0,
          note: `Arsipkan jenis bibit: ${seed.name}`,
        },
      }),
      prisma.seed.update({
        where: { id: seedId },
        data: {
          isActive: false,
          archivedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ message: 'Jenis bibit berhasil diarsipkan' });
  } catch (error) {
    console.error('Seeds DELETE error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
