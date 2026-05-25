import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import DodoPayments from 'dodopayments';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const customerEmail = user?.emailAddresses?.[0]?.emailAddress;

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 400 }
      );
    }

    // Initialize DodoPayments client
    const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY;
    if (!DODO_API_KEY) {
      return NextResponse.json(
        { error: 'Payment configuration error' },
        { status: 500 }
      );
    }

    const envMode = process.env.DODO_PAYMENTS_ENVIRONMENT;
    const environment: 'test_mode' | 'live_mode' = envMode === 'live_mode' ? 'live_mode' : 'test_mode';

    const client = new DodoPayments({
      bearerToken: DODO_API_KEY,
      environment,
    });

    // Get customer portal URL
    // DodoPayments typically provides a customer portal URL in the format:
    // https://app.dodopayments.com/customer-portal/{customer_id}
    // We'll construct it based on the customer email or ID

    // First, we need to get the customer ID from our backend
    const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token not found' },
        { status: 401 }
      );
    }

    // Fetch user subscription data from backend
    const response = await fetch(`${BACKEND_BASE_URL}/api/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch subscription data' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // DodoPayments customer portal URL
    // Based on DodoPayments documentation, the customer portal is typically:
    // https://dodopayments.com/customer-portal or business-specific URL
    const portalUrl = 'https://dodopayments.com/customer-portal';

    return NextResponse.json({
      portalUrl,
      customerEmail,
    });
  } catch (error) {
    console.error('Billing portal API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate portal URL' },
      { status: 500 }
    );
  }
}
