import { NextResponse } from 'next/server';

// Simulated garden data
let gardenData = {
  plants: [],
  activities: [],
  harvests: [],
};

// GET - Get garden data for a user
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type'); // 'plants', 'activities', 'harvests'

  if (userId) {
    // Filter by user (in production, query database)
    const userGarden = {
      plants: gardenData.plants.filter(p => p.userId === parseInt(userId)),
      activities: gardenData.activities.filter(a => a.userId === parseInt(userId)),
      harvests: gardenData.harvests.filter(h => h.userId === parseInt(userId)),
    };

    if (type) {
      return NextResponse.json(userGarden[type] || []);
    }

    return NextResponse.json(userGarden);
  }

  return NextResponse.json(gardenData);
}

// POST - Add plant, activity, or harvest
export async function POST(request) {
  const body = await request.json();
  const { type, userId, data } = body;

  switch (type) {
    case 'plant':
      const newPlant = {
        id: Date.now(),
        userId: parseInt(userId),
        plantedDate: new Date().toISOString(),
        status: 'tumbuh',
        ...data,
      };
      gardenData.plants.push(newPlant);
      return NextResponse.json({ message: 'Plant added', plant: newPlant }, { status: 201 });

    case 'activity':
      const newActivity = {
        id: Date.now(),
        userId: parseInt(userId),
        date: new Date().toISOString(),
        ...data,
      };
      gardenData.activities.push(newActivity);
      return NextResponse.json({ message: 'Activity added', activity: newActivity }, { status: 201 });

    case 'harvest':
      const newHarvest = {
        id: Date.now(),
        userId: parseInt(userId),
        date: new Date().toISOString(),
        ...data,
      };
      gardenData.harvests.push(newHarvest);
      return NextResponse.json({ message: 'Harvest recorded', harvest: newHarvest }, { status: 201 });

    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}

// PUT - Update plant status
export async function PUT(request) {
  const body = await request.json();
  const { plantId, updates } = body;

  const plantIndex = gardenData.plants.findIndex(p => p.id === parseInt(plantId));

  if (plantIndex === -1) {
    return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
  }

  gardenData.plants[plantIndex] = {
    ...gardenData.plants[plantIndex],
    ...updates,
  };

  return NextResponse.json({ message: 'Plant updated', plant: gardenData.plants[plantIndex] });
}

// DELETE - Remove plant, activity, or harvest
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  switch (type) {
    case 'plant':
      gardenData.plants = gardenData.plants.filter(p => p.id !== parseInt(id));
      return NextResponse.json({ message: 'Plant deleted' });

    case 'activity':
      gardenData.activities = gardenData.activities.filter(a => a.id !== parseInt(id));
      return NextResponse.json({ message: 'Activity deleted' });

    case 'harvest':
      gardenData.harvests = gardenData.harvests.filter(h => h.id !== parseInt(id));
      return NextResponse.json({ message: 'Harvest deleted' });

    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}
