import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { getServerSession } from '@/lib/session';

// GET - Obtener todos los administradores
export async function GET(request: NextRequest) {
  try {
    // Verificar sesión
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener todos los administradores
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error('Error al obtener administradores:', error);
    return NextResponse.json(
      { error: 'Ha ocurrido un error inesperado' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo administrador
export async function POST(request: NextRequest) {
  try {
    // Verificar sesión
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    // Validar campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'El email y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Ya existe un administrador con este email' },
        { status: 400 }
      );
    }

    // Crear nuevo administrador
    const hashedPassword = hashPassword(password);
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      admin: newAdmin,
    });
  } catch (error) {
    console.error('Error al crear administrador:', error);
    return NextResponse.json(
      { error: 'Ha ocurrido un error inesperado' },
      { status: 500 }
    );
  }
} 