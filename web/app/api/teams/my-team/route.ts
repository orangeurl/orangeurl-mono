import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';

export async function GET(request: NextRequest) {
  try {
    console.log('[Next.js API] My team info called');

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

    const backendUrl = `${BACKEND_BASE_URL}/api/teams/my-team`;
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

    // If 404, user is not part of a team - return empty response
    if (response.status === 404) {
      console.log('[Next.js API] User not in a team (404)');
      return NextResponse.json(
        { team: null, members: [] },
        { status: 200 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch team info' }));
      console.log('[Next.js API] Backend error:', errorData);
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Next.js API] Returning team info successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Next.js API] Team info API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
