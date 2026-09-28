import { NextResponse } from 'next/server';
import { getArtData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getArtData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch art data' }, { status: 500 });
  }
}
