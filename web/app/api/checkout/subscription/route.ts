import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

// Use the official TypeScript client
// Docs: https://github.com/dodopayments/dodopayments-typescript
import DodoPayments from 'dodopayments';

// Allowed payment methods per your instruction
const ALLOWED_METHODS: Array<
  | 'credit' | 'debit' | 'apple_pay' | 'google_pay'
  | 'upi_collect' | 'upi_intent' | 'cashapp' | 'multibanco'
  | 'bancontact_card' | 'eps' | 'ideal' | 'przelewy24'
  | 'affirm' | 'klarna' | 'sepa' | 'ach' | 'amazon_pay' | 'afterpay_clearpay'
> = ['credit', 'debit', 'apple_pay', 'google_pay'];

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Initialize client inside the function to avoid build-time errors
    const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY;
    const PRO_MONTHLY = process.env.DODO_PRO_MONTHLY_PRODUCT_ID;
    const PREMIUM_MONTHLY = process.env.DODO_PREMIUM_MONTHLY_PRODUCT_ID;
    const PRO_ANNUAL = process.env.DODO_PRO_ANNUAL_PRODUCT_ID;
    const PREMIUM_ANNUAL = process.env.DODO_PREMIUM_ANNUAL_PRODUCT_ID;

    // Check if environment variables are set
    if (!DODO_API_KEY || DODO_API_KEY.includes('xxx') || DODO_API_KEY.includes('placeholder')) {
      console.error('DODO_PAYMENTS_API_KEY is not properly set');
      return NextResponse.json(
        { error: 'Payment configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    if (!PRO_MONTHLY || !PREMIUM_MONTHLY || PRO_MONTHLY.includes('xxx') || PREMIUM_MONTHLY.includes('xxx')) {
      console.error('Product IDs are not properly set');
      return NextResponse.json(
        { error: 'Product configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    if (!PRO_ANNUAL || !PREMIUM_ANNUAL || PRO_ANNUAL.includes('xxx') || PREMIUM_ANNUAL.includes('xxx')) {
      console.error('Annual Product IDs are not properly set');
      return NextResponse.json(
        { error: 'Product configuration error. Please contact support.' },
        { status: 500 }
      );
    }
    
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.orangeurl.live';
    // DodoPayments will redirect here after payment
    // Note: DodoPayments handles failed/cancelled payments via their UI
    // and webhook events (subscription.failed, subscription.cancelled)
    const RETURN_URL = `${APP_URL}/pricing?payment=completed`;
    
    // Get user's email from Clerk
    const user = await currentUser();
    const customerEmail = user?.emailAddresses?.[0]?.emailAddress || '';

    // Debug logging
    console.log('User ID:', userId);
    console.log('User object:', JSON.stringify(user, null, 2));
    console.log('Email addresses:', user?.emailAddresses);
    console.log('Customer email:', customerEmail);
    console.log('API key length:', DODO_API_KEY?.length);
    console.log('API key starts with:', DODO_API_KEY?.substring(0, 10));
    console.log('Pro product ID:', PRO_MONTHLY);
    console.log('Premium product ID:', PREMIUM_MONTHLY);
    
    // DodoPayments API key format: The key is the bearer token itself
    // Environment is determined by whether you're using a test or live API key from dashboard
    console.log('API key format check:', {
      startsWith: DODO_API_KEY?.substring(0, 15),
      keyLength: DODO_API_KEY?.length,
    });
    
    // Use the API key as-is. The SDK will send it as: Authorization: Bearer {your_key}
    // Read environment from env variable (defaults to test_mode)
    const envMode = process.env.DODO_PAYMENTS_ENVIRONMENT;
    const environment: 'test_mode' | 'live_mode' = envMode === 'live_mode' ? 'live_mode' : 'test_mode';

    console.log('Using environment:', environment);

    const client = new DodoPayments({
      bearerToken: DODO_API_KEY, // Your API key from dashboard (e.g., gEZrZ01T3F8vKB8T...)
      environment,
    });

    const body = await req.json().catch(() => ({}));
    const plan: string = (body?.plan || '').toLowerCase();
    const billingInterval: string = (body?.billingInterval || 'monthly').toLowerCase();
    console.log('Requested plan:', plan, 'Billing interval:', billingInterval);

    let productId: string | null = null;

    // Select product ID based on plan and billing interval
    if (plan === 'pro') {
      productId = billingInterval === 'annual' ? PRO_ANNUAL : PRO_MONTHLY;
    } else if (plan === 'premium') {
      productId = billingInterval === 'annual' ? PREMIUM_ANNUAL : PREMIUM_MONTHLY;
    }

    console.log('Selected product ID:', productId);

    if (!productId) {
      return NextResponse.json({ error: 'Invalid plan or billing interval' }, { status: 400 });
    }

    // Build the Checkout Session
    // Source: https://github.com/dodopayments/dodopayments-typescript/blob/main/README.md
    console.log('Creating checkout session with params:', {
      product_id: productId,
      return_url: RETURN_URL,
      allowed_methods: ALLOWED_METHODS,
      customer_email: customerEmail,
    });

    let checkout;
    try {
      checkout = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      allowed_payment_method_types: ALLOWED_METHODS,
      return_url: RETURN_URL,
      show_saved_payment_methods: true,
      // Add customer details to pre-fill the checkout form
      customer: customerEmail ? {
        email: customerEmail,
      } : undefined,
      // Add metadata to identify the user
      metadata: {
        user_id: userId,
        plan: plan,
        billing_interval: billingInterval,
        customer_email: customerEmail,
      },
    });
    } catch (createError: any) {
      // If test_mode fails, try live_mode
      if (createError?.status === 401) {
        console.log('Test mode failed, trying live mode');
        const liveClient = new DodoPayments({
          bearerToken: DODO_API_KEY,
          environment: 'live_mode',
        });
        
        checkout = await liveClient.checkoutSessions.create({
          product_cart: [
            {
              product_id: productId,
              quantity: 1,
            },
          ],
          allowed_payment_method_types: ALLOWED_METHODS,
          return_url: RETURN_URL,
          show_saved_payment_methods: true,
          // Add customer details to pre-fill the checkout form
          customer: customerEmail ? {
            email: customerEmail,
          } : undefined,
          // Add metadata to identify the user
          metadata: {
            user_id: userId,
            plan: plan,
            billing_interval: billingInterval,
            customer_email: customerEmail,
          },
        });
      } else {
        throw createError;
      }
    }
    
    console.log('Full checkout response:', JSON.stringify(checkout, null, 2));
    console.log('Response keys:', Object.keys(checkout as any));

    // ALWAYS use checkout_url from the official API response
    // This is the documented field that DodoPayments provides
    const checkoutUrl = (checkout as any).checkout_url;

    if (!checkoutUrl) {
      console.error('No checkout_url in response:', checkout);
      return NextResponse.json(
        { error: 'Checkout URL missing in response', checkout },
        { status: 500 }
      );
    }

    console.log('Using official checkout_url from API:', checkoutUrl);
    return NextResponse.json({ link: checkoutUrl });
  } catch (err: any) {
    console.error('DodoPayments checkout error:', err);
    console.error('Error type:', err?.constructor?.name);
    console.error('Error status:', err?.status, err?.statusCode);
    console.error('Error message:', err?.message);
    console.error('Full error:', JSON.stringify(err, null, 2));
    
    // Try to extract more specific error information
    let errorMessage = 'Failed to create checkout session';
    let statusCode = 500;
    
    if (err?.message) {
      errorMessage = err.message;
    } else if (err?.error) {
      errorMessage = err.error;
    }
    
    // Check for authentication errors
    if (err?.status === 401 || err?.statusCode === 401) {
      errorMessage = 'Authentication failed. Please check your API key.';
      statusCode = 401;
    }
    
    // Check for permission errors
    if (err?.status === 403 || err?.statusCode === 403) {
      errorMessage = 'Access denied. Please check your API key permissions.';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: err?.response?.data || err?.data },
      { status: statusCode }
    );
  }
}

