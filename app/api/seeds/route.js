import { NextResponse } from 'next/server';
import { vegetables } from '../../../data/staticData';

// Simulated seed bank transactions
let transactions = [
  {
    id: 1,
    userId: 1,
    transactionType: 'ambil',
    vegetableId: 1,
    vegetableName: 'Kangkung',
    quantity: 20,
    date: '2025-01-10',
    contributionPaid: 2000,
    status: 'selesai',
  },
  {
    id: 2,
    userId: 2,
    transactionType: 'ambil',
    vegetableId: 4,
    vegetableName: 'Cabai Rawit',
    quantity: 10,
    date: '2025-01-09',
    contributionPaid: 3000,
    status: 'selesai',
  },
];

// GET - Get seeds or transactions
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'seeds', 'transactions', 'stock'
  const userId = searchParams.get('userId');

  if (type === 'seeds') {
    return NextResponse.json(vegetables);
  }

  if (type === 'transactions') {
    if (userId) {
      return NextResponse.json(transactions.filter(t => t.userId === parseInt(userId)));
    }
    return NextResponse.json(transactions);
  }

  if (type === 'stock') {
    const stock = vegetables.map(v => ({
      id: v.id,
      name: v.name,
      category: v.category,
      stockAvailable: v.stockAvailable,
      price: v.price,
    }));
    return NextResponse.json(stock);
  }

  // Default: return all seeds
  return NextResponse.json(vegetables);
}

// POST - Order seeds or return seeds
export async function POST(request) {
  const body = await request.json();
  const { type, userId, vegetableId, quantity, vegetableName } = body;

  switch (type) {
    case 'order':
      // Calculate contribution
      const vegetable = vegetables.find(v => v.id === vegetableId);
      const contribution = vegetable.price * quantity;

      const newTransaction = {
        id: Date.now(),
        userId: parseInt(userId),
        transactionType: 'ambil',
        vegetableId,
        vegetableName,
        quantity,
        date: new Date().toISOString().split('T')[0],
        contributionPaid: contribution,
        status: 'selesai',
      };

      transactions.push(newTransaction);

      return NextResponse.json(
        { message: 'Order successful', transaction: newTransaction },
        { status: 201 }
      );

    case 'return':
      // Calculate contribution received (2x return)
      const veg = vegetables.find(v => v.id === vegetableId);
      const contributionReceived = veg.price * quantity * 2;

      const returnTransaction = {
        id: Date.now(),
        userId: parseInt(userId),
        transactionType: 'kembalikan',
        vegetableId,
        vegetableName,
        quantity,
        date: new Date().toISOString().split('T')[0],
        contributionReceived,
        status: 'selesai',
      };

      transactions.push(returnTransaction);

      return NextResponse.json(
        { message: 'Return successful', transaction: returnTransaction },
        { status: 201 }
      );

    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}
