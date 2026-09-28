import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminCookie = req.cookies.get('admin_session');
  const isAdmin = adminCookie?.value === 'authenticated_token_2026';

  return NextResponse.json({ isAdmin });
}

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('admin_session');
  return response;
}
