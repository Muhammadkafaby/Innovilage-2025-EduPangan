import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAuthUser } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unread = searchParams.get('unread');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId diperlukan' },
        { status: 400 }
      );
    }

    const where = { userId: parseInt(userId) };
    if (unread === 'true') {
      where.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Notifications GET error:', error);
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
    const { userId, type, title, message, icon } = body;

    const notification = await prisma.notification.create({
      data: {
        userId: parseInt(userId),
        type,
        title,
        message,
        icon,
        read: false,
      },
    });

    return NextResponse.json(
      { message: 'Notification created', notification },
      { status: 201 }
    );
  } catch (error) {
    console.error('Notifications POST error:', error);
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
    const { notificationId, markAll, userId } = body;

    if (markAll) {
      const targetUserId = userId ? parseInt(userId) : auth.id;
      await prisma.notification.updateMany({
        where: { userId: targetUserId },
        data: { read: true },
      });
      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    const notification = await prisma.notification.update({
      where: { id: parseInt(notificationId) },
      data: { read: true },
    });

    return NextResponse.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Notifications PUT error:', error);
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
    const id = searchParams.get('id');

    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Notifications DELETE error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
