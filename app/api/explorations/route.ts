import { NextResponse } from 'next/server';
import { getExplorationsData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getExplorationsData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch explorations data' }, { status: 500 });
  }
}
