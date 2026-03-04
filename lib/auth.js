import jwt from 'jsonwebtoken';
import prisma from './prisma';

export async function getAuthUser(request) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return null;
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
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export function requireAuth() {
  return async (request) => {
    const user = await getAuthUser(request);
    if (!user) {
      return { error: 'Belum login', status: 401 };
    }
    return { user };
  };
}

export function requireAdmin() {
  return async (request) => {
    const auth = await requireAuth()(request);
    if (auth.error) {
      return auth;
    }
    if (auth.user.role !== 'admin' && auth.user.role !== 'kader') {
      return { error: 'Akses ditolak', status: 403 };
    }
    return auth;
  };
}
