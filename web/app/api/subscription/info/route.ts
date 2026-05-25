import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';

export async function GET(request: NextRequest) {
  try {
    console.log('[Next.js API] Subscription info called');

    // Get Clerk authentication token
    const authResult = await auth();
    const { getToken } = authResult;
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_BASE_URL}/api/subscription/info`;
    console.log('[Next.js API] Calling backend:', backendUrl);

    // Forward request to Go backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch subscription info' }));
      console.log('[Next.js API] Backend error:', errorData);
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Next.js API] Subscription info API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
