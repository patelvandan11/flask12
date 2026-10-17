import { NextResponse } from 'next/server';
import { saveBeyondCodingData } from '@/lib/contentStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    const result = await saveBeyondCodingData(body.data);
    return NextResponse.json({ success: true, provider: result.provider });
  } catch (error) {
    console.error('Error in /api/beyond-coding/save:', error);
    return NextResponse.json({ error: 'Failed to save beyond coding data' }, { status: 500 });
  }
}
