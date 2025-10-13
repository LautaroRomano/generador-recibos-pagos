import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { verifyJWT, extractTokenFromCookies, JWTPayload } from './jwt';

/**
 * Obtiene la sesión del servidor a partir del JWT token
 * Incluye verificación de base de datos para endpoints de API
 */
export async function getServerSession(request: NextRequest): Promise<{
  isLoggedIn: boolean;
  admin?: JWTPayload;
} | null> {
  // Intentar obtener el token de las cookies
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    return null;
  }

  // Verificar el JWT token
  const payload = await verifyJWT(token);
  
  if (!payload) {
    return null;
  }

  // Verificar que el admin aún existe en la base de datos
  const admin = await prisma.admin.findUnique({
    where: { id: payload.adminId },
    select: { id: true, email: true, name: true }
  });

  if (!admin) {
    return null;
  }

  return {
    isLoggedIn: true,
    admin: {
      adminId: admin.id,
      email: admin.email,
      name: admin.name || undefined
    }
  };
}

/**
 * Verifica solo el JWT token sin consultar la base de datos
 * Para usar en middleware donde Prisma no está disponible
 */
export async function verifyJWTSession(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    return null;
  }

  return await verifyJWT(token);
} 