import { NextResponse } from 'next/server';
import { getProjectsData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getProjectsData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects data' }, { status: 500 });
  }
}
