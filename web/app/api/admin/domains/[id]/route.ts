import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL?.replace('/api/v1', '') || 'https://api.orangeurl.live';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const response = await fetch(`${BACKEND_BASE_URL}/api/admin/domains/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to unblock domain' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Admin unblock domain error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
