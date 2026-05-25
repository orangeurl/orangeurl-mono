import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://api.orangeurl.live';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Forward the request to the Go backend
    const response = await fetch(`${BACKEND_URL}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to join waitlist' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



