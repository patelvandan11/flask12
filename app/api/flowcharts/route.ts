import { NextRequest, NextResponse } from 'next/server';
import { getFlowchartsData } from '@/lib/flowchartStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const flowcharts = await getFlowchartsData();
    return NextResponse.json(flowcharts);
  } catch (error) {
    console.error('Failed to read flowchart data:', error);
    return NextResponse.json({ error: 'Failed to read flowchart data' }, { status: 500 });
  }
}
