import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://api.orangeurl.live';

export async function GET(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ isRegistered: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json({ isRegistered: false, message: 'Unauthorized: No Clerk token' }, { status: 401 });
    }

    // Forward the request to the Go backend's protected endpoint
    const response = await fetch(`${BACKEND_URL}/api/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Backend returned 200, meaning user is registered
      return NextResponse.json({ isRegistered: true, message: 'User is registered' }, { status: 200 });
    } else if (response.status === 403) {
      // Backend returned 403, meaning user is not registered in our DB
      const errorData = await response.json();
      return NextResponse.json({ isRegistered: false, message: errorData.message || 'User not registered in backend' }, { status: 403 });
    } else {
      // Other backend errors
      const errorData = await response.json();
      console.error('Backend API error:', response.status, errorData);
      return NextResponse.json({ isRegistered: false, message: errorData.message || 'Backend error' }, { status: response.status });
    }
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json({ isRegistered: false, message: 'Internal server error' }, { status: 500 });
  }
}

