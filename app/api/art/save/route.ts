import { NextRequest, NextResponse } from 'next/server';
import { saveArtData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const adminCookie = req.cookies.get('admin_session');
    if (adminCookie?.value !== 'authenticated_token_2026') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }

    const { data } = await req.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ success: false, error: 'Invalid payload: data must be an array' }, { status: 400 });
    }

    const result = await saveArtData(data);
    return NextResponse.json({ success: true, message: `Art saved via ${result.provider}`, provider: result.provider, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save art data' }, { status: 500 });
  }
}
