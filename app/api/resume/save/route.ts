import { NextRequest, NextResponse } from 'next/server';
import { saveResumeData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const adminCookie = req.cookies.get('admin_session');
    if (adminCookie?.value !== 'authenticated_token_2026') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }

    const { data } = await req.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload: data must be an object' }, { status: 400 });
    }

    const result = await saveResumeData(data);
    return NextResponse.json({ success: true, message: `Resume saved via ${result.provider}`, provider: result.provider, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save resume data' }, { status: 500 });
  }
}
