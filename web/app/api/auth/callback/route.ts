import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'signup' or 'signin'

    console.log(`🔄 Auth callback triggered - Mode: ${mode}, User ID: ${userId}`);

    if (userId && mode) {
      console.log(`📡 User authenticated successfully in ${mode} mode`);
    }

    // Redirect to dashboard after successful authentication
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  } catch (error) {
    console.error('❌ Error in auth callback:', error);
    
    // Redirect to home page on error
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
