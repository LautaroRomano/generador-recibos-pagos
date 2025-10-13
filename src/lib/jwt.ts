import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura-aqui-cambiar-en-produccion'
);

export interface JWTPayload {
  adminId: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

/**
 * Genera un JWT token para el administrador
 */
export async function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token válido por 7 días
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verifica y decodifica un JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extrae el token JWT del header Authorization
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Extrae el token JWT de las cookies
 */
export function extractTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const tokenCookie = cookies.find(cookie => cookie.startsWith('admin_token='));
  
  if (!tokenCookie) return null;
  
  return tokenCookie.split('=')[1];
}
