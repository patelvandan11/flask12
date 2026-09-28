import { NextResponse } from 'next/server';
import { getResumeData } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getResumeData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resume data' }, { status: 500 });
  }
}
