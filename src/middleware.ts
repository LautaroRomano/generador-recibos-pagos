import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

// Define las rutas públicas que no necesitan autenticación
const publicRoutes = ['/login','/logo.jpg','/favicon.ico','/robots.txt','/sitemap.xml'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Si es una ruta pública, permitir el acceso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Si es una ruta de API, permitir que el endpoint maneje la autenticación
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Verificar el token JWT directamente (sin Prisma en middleware)
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?callbackUrl=${encodeURIComponent(request.url)}`;
    return NextResponse.redirect(url);
  }

  // Verificar que el JWT sea válido
  const payload = await verifyJWT(token);
  if (!payload) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?callbackUrl=${encodeURIComponent(request.url)}`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Especificar en qué rutas debe ejecutarse el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api (endpoints de API que manejan su propia autenticación)
     * 2. /_next (recursos internos de Next.js)
     * 3. /static (recursos estáticos)
     * 4. /favicon.ico, /robots.txt, /sitemap.xml
     */
    '/((?!api|_next|static|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
