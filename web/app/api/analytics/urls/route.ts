import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Use base URL without /api/v1 suffix
const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';

export async function GET(request: NextRequest) {
  try {
    // Get Clerk authentication token
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Forward request to Go backend
    const response = await fetch(`${BACKEND_BASE_URL}/api/analytics/urls`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch URLs' }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('URLs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

