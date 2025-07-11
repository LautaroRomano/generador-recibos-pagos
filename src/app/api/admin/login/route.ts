import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 401 }
      );
    }

    if(admin.password === 'RESET') {
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          password: hashPassword(password),
        },
      });
    }else{
    // Verify password
    const isPasswordValid = verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  }


    // Create a session token
    const sessionToken = uuidv4();
    
    // Create response
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
    
    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'admin_session',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      // Set secure to true in production
      secure: process.env.NODE_ENV === 'production',
      // 7 day expiration
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 