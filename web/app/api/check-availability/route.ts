import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://api.orangeurl.live/api/v1';

export async function POST(request: NextRequest) {
  try {
    const { customShort } = await request.json();
    
    if (!customShort) {
      return NextResponse.json(
        { error: 'Custom short is required' },
        { status: 400 }
      );
    }

    // Check availability by trying to resolve the short URL
    // If it exists, we'll get a response, if not, it's available
    const checkUrl = `${BACKEND_URL.replace('/api/v1', '')}/${customShort}`;
    
    console.log('BACKEND_URL:', BACKEND_URL);
    console.log('Constructed checkUrl:', checkUrl);
    
    try {
      console.log('Checking availability for URL:', checkUrl);
      const response = await fetch(checkUrl, {
        method: 'HEAD', // Use HEAD to avoid downloading content
        redirect: 'manual' // Don't follow redirects
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 302 || response.status === 301) {
        // URL exists and redirects
        console.log('URL is taken - redirect detected');
        return NextResponse.json({ 
          available: false, 
          message: 'This short URL is already taken' 
        });
      } else if (response.status === 404) {
        // URL doesn't exist - this is what we want for available URLs
        console.log('URL is available - 404 not found');
        return NextResponse.json({ 
          available: true, 
          message: 'This short URL is available' 
        });
      } else if (response.status === 500) {
        // Server error - assume available for now
        console.log('Server error - assuming available');
        return NextResponse.json({ 
          available: true, 
          message: 'This short URL is available' 
        });
      } else {
        // Other status codes
        console.log('URL status unclear - status:', response.status);
        return NextResponse.json({ 
          available: true, 
          message: 'This short URL is available' 
        });
      }
    } catch (error) {
      // If fetch fails, assume it's available
      return NextResponse.json({ 
        available: true, 
        message: 'This short URL is available' 
      });
    }
    
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 