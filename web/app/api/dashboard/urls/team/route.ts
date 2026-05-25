import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';

export async function GET(request: NextRequest) {
  try {
    console.log('[Next.js API] Team URLs called');

    // Get Clerk authentication token
    const authResult = await auth();
    const { getToken } = authResult;
    const token = await getToken();

    if (!token) {
      console.log('[Next.js API] No token - returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_BASE_URL}/api/dashboard/urls/team`;
    console.log('[Next.js API] Calling backend:', backendUrl);

    // Forward request to Go backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[Next.js API] Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch team URLs' }));
      console.log('[Next.js API] Backend error:', errorData);
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Next.js API] Returning team URLs successfully, count:', data.urls?.length || 0);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Next.js API] Team URLs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
