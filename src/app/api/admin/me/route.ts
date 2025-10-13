import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    
    if (!session || !session.isLoggedIn || !session.admin) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: session.admin.adminId,
        email: session.admin.email,
        name: session.admin.name,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
