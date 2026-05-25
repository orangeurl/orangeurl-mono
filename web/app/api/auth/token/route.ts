import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Token API error:', error);
    return NextResponse.json(
      { error: 'Failed to get token' },
      { status: 500 }
    );
  }
}




