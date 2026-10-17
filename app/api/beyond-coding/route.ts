import { NextResponse } from 'next/server';
import { getBeyondCodingData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getBeyondCodingData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch beyond coding data' }, { status: 500 });
  }
}
