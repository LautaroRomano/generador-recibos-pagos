import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define las rutas públicas que no necesitan autenticación
const publicRoutes = ['/login','/logo.jpg','/favicon.ico','/robots.txt','/sitemap.xml'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Si es una ruta pública, permitir el acceso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Si es una ruta de API, permitir que el endpoint maneje la autenticación
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Verificar si existe la cookie de sesión
  const adminSession = request.cookies.get('admin_session');
  
  // Si no hay sesión, redirigir al login
  if (!adminSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Agregar la URL original como parámetro para redirigir después del login
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
