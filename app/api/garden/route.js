import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAuthUser } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId diperlukan' },
        { status: 400 }
      );
    }

    const where = { userId: parseInt(userId) };

    if (type === 'plants') {
      const plants = await prisma.plant.findMany({
        where,
        orderBy: { plantedDate: 'desc' },
      });
      return NextResponse.json(plants);
    }

    if (type === 'activities') {
      const activities = await prisma.activity.findMany({
        where,
        orderBy: { date: 'desc' },
      });
      return NextResponse.json(activities);
    }

    if (type === 'harvests') {
      const harvests = await prisma.harvest.findMany({
        where,
        orderBy: { harvestDate: 'desc' },
      });
      return NextResponse.json(harvests);
    }

    const [plants, activities, harvests] = await Promise.all([
      prisma.plant.findMany({ where, orderBy: { plantedDate: 'desc' } }),
      prisma.activity.findMany({ where, orderBy: { date: 'desc' } }),
      prisma.harvest.findMany({ where, orderBy: { harvestDate: 'desc' } }),
    ]);

    return NextResponse.json({ plants, activities, harvests });
  } catch (error) {
    console.error('Garden GET error:', error);
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
    const { type, userId, data } = body;
    const parsedUserId = parseInt(userId);

    switch (type) {
      case 'plant': {
        const newPlant = await prisma.plant.create({
          data: {
            userId: parsedUserId,
            name: data.name,
            quantity: parseInt(data.quantity),
            growthPeriod: data.growthPeriod,
            category: data.category,
            status: 'tumbuh',
          },
        });

        await prisma.activity.create({
          data: {
            userId: parsedUserId,
            type: 'tanam',
            plantName: data.name,
            quantity: parseInt(data.quantity),
            status: 'tumbuh',
          },
        });

        return NextResponse.json(
          { message: 'Plant added', plant: newPlant },
          { status: 201 }
        );
      }

      case 'activity': {
        const newActivity = await prisma.activity.create({
          data: {
            userId: parsedUserId,
            type: data.type,
            plantName: data.plantName,
            quantity: data.quantity ? parseFloat(data.quantity) : null,
            unit: data.unit,
            status: data.status,
            expectedHarvest: data.expectedHarvest,
          },
        });

        return NextResponse.json(
          { message: 'Activity added', activity: newActivity },
          { status: 201 }
        );
      }

      case 'harvest': {
        const newHarvest = await prisma.harvest.create({
          data: {
            userId: parsedUserId,
            plantType: data.plantType,
            plantName: data.plantName,
            quantity: parseFloat(data.quantity),
            unit: data.unit || 'kg',
            harvestDate: data.harvestDate ? new Date(data.harvestDate) : new Date(),
            notes: data.notes,
            photo: data.photo,
          },
        });

        await prisma.activity.create({
          data: {
            userId: parsedUserId,
            type: 'panen',
            plantName: data.plantType,
            quantity: parseFloat(data.quantity),
            unit: data.unit || 'kg',
            status: 'selesai',
          },
        });

        return NextResponse.json(
          { message: 'Harvest recorded', harvest: newHarvest },
          { status: 201 }
        );
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Garden POST error:', error);
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

    const body = await request.json();
    const { plantId, updates } = body;

    const plant = await prisma.plant.update({
      where: { id: parseInt(plantId) },
      data: updates,
    });

    return NextResponse.json({ message: 'Plant updated', plant });
  } catch (error) {
    console.error('Garden PUT error:', error);
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    const parsedId = parseInt(id);

    switch (type) {
      case 'all': {
        if (!userId) {
          return NextResponse.json(
            { error: 'userId diperlukan untuk hapus semua data' },
            { status: 400 }
          );
        }

        const parsedUserId = parseInt(userId);
        await prisma.$transaction([
          prisma.harvest.deleteMany({ where: { userId: parsedUserId } }),
          prisma.activity.deleteMany({ where: { userId: parsedUserId } }),
          prisma.plant.deleteMany({ where: { userId: parsedUserId } }),
        ]);

        return NextResponse.json({ message: 'Semua data kebun berhasil dihapus' });
      }

      case 'plant':
        await prisma.plant.delete({ where: { id: parsedId } });
        return NextResponse.json({ message: 'Plant deleted' });

      case 'activity':
        await prisma.activity.delete({ where: { id: parsedId } });
        return NextResponse.json({ message: 'Activity deleted' });

      case 'harvest':
        await prisma.harvest.delete({ where: { id: parsedId } });
        return NextResponse.json({ message: 'Harvest deleted' });

      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Garden DELETE error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
