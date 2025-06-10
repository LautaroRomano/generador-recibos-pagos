import { NextRequest } from 'next/server';
import { prisma } from './prisma';

/**
 * Obtiene la sesión del servidor a partir de la cookie
 */
export async function getServerSession(request: NextRequest) {
  const sessionToken = request.cookies.get('admin_session')?.value;
  
  if (!sessionToken) {
    return null;
  }

  // Aquí podríamos verificar el token en una tabla de sesiones en la base de datos
  // Por simplicidad, sólo verificamos que exista la cookie
  return {
    isLoggedIn: true,
    // Podríamos obtener más información del admin aquí si guardáramos el ID en la cookie
  };
} 