import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const response = await fetch(`${BACKEND_BASE_URL}/api/admin/users/${id}/unban`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to unban user' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Admin unban user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
