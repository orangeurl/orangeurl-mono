import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';

export async function GET(request: NextRequest) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ tier: 'free' });
    }

    // Get dashboard stats which includes tier info
    const response = await fetch(`${BACKEND_BASE_URL}/api/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ tier: 'free' });
    }

    const data = await response.json();
    return NextResponse.json({ 
      tier: data.plan_name.toLowerCase(),
      features: data.features 
    });
  } catch (error) {
    console.error('Tier API error:', error);
    return NextResponse.json({ tier: 'free' });
  }
}



