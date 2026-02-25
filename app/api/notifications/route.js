import { NextResponse } from 'next/server';

// Simulated notifications
let notifications = [
  {
    id: 1,
    type: 'reminder',
    title: 'Waktunya Menyiram!',
    message: 'Kangkung dan Bayam Anda perlu disiram pagi ini',
    date: '202.5-01-12 06:00',
    read: false,
    icon: '💧',
    userId: 1,
  },
  {
    id: 2,
    type: 'harvest',
    title: 'Siap Panen!',
    message: 'Bayam Anda sudah siap dipanen (ditanam 30 hari lalu)',
    date: '202.5-01-11 08:00',
    read: false,
    icon: '🌿',
    userId: 1,
  },
  {
    id: 3,
    type: 'stock',
    title: 'Bibit Baru Tersedia',
    message: 'Bibit Tomat Cherry baru saja tersedia di Bank Bibit',
    date: '202.5-01-10 14:30',
    read: true,
    icon: '🌱',
    userId: 1,
  },
];

// GET - Get notifications
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const unread = searchParams.get('unread');

  let filteredNotifications = notifications;

  if (userId) {
    filteredNotifications = notifications.filter(n => n.userId === parseInt(userId));
  }

  if (unread === 'true') {
    filteredNotifications = filteredNotifications.filter(n => !n.read);
  }

  return NextResponse.json(filteredNotifications);
}

// POST - Create notification
export async function POST(request) {
  const body = await request.json();

  const newNotification = {
    id: Date.now(),
    date: new Date().toISOString(),
    read: false,
    ...body,
  };

  notifications.push(newNotification);

  return NextResponse.json(
    { message: 'Notification created', notification: newNotification },
    { status: 201 }
  );
}

// PUT - Mark notification as read
export async function PUT(request) {
  const body = await request.json();
  const { notificationId, markAll } = body;

  if (markAll) {
    notifications = notifications.map(n => ({ ...n, read: true }));
    return NextResponse.json({ message: 'All notifications marked as read' });
  }

  const notificationIndex = notifications.findIndex(n => n.id === parseInt(notificationId));

  if (notificationIndex === -1) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  notifications[notificationIndex] = {
    ...notifications[notificationIndex],
    read: true,
  };

  return NextResponse.json({ message: 'Notification marked as read', notification: notifications[notificationIndex] });
}

// DELETE - Delete notification
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  notifications = notifications.filter(n => n.id !== parseInt(id));

  return NextResponse.json({ message: 'Notification deleted' });
}
