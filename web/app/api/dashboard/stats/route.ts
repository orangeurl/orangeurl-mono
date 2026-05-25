import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Use base URL without /api/v1 suffix
const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';

export async function GET(request: NextRequest) {
  try {
    console.log('[Next.js API] Dashboard stats called');
    console.log('[Next.js API] BACKEND_BASE_URL:', BACKEND_BASE_URL);
    console.log('[Next.js API] Environment check - BACKEND_URL:', process.env.BACKEND_URL);
    console.log('[Next.js API] Environment check - CLERK_SECRET_KEY exists:', !!process.env.CLERK_SECRET_KEY);
    
    // Get Clerk authentication token
    let authResult;
    try {
      authResult = await auth();
      console.log('[Next.js API] Auth result obtained');
    } catch (authError) {
      console.error('[Next.js API] Auth failed:', authError);
      throw new Error(`Clerk auth failed: ${authError instanceof Error ? authError.message : String(authError)}`);
    }

    const { getToken } = authResult;
    let token;
    try {
      token = await getToken();
      console.log('[Next.js API] Token obtained:', token ? 'Yes (length: ' + token.length + ')' : 'No');
    } catch (tokenError) {
      console.error('[Next.js API] GetToken failed:', tokenError);
      throw new Error(`GetToken failed: ${tokenError instanceof Error ? tokenError.message : String(tokenError)}`);
    }

    if (!token) {
      console.log('[Next.js API] No token - returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_BASE_URL}/api/dashboard/stats`;
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
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch dashboard stats' }));
      console.log('[Next.js API] Backend error:', errorData);
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Next.js API] Returning data successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Next.js API] Dashboard stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

