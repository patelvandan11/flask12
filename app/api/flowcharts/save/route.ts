import { NextRequest, NextResponse } from 'next/server';
import { getFlowchartsData, saveFlowchartsData } from '@/lib/flowchartStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const adminCookie = req.cookies.get('admin_session');
    if (adminCookie?.value !== 'authenticated_token_2026') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { projectId, flowchartData, fullData } = body;

    let currentData = await getFlowchartsData();

    if (fullData) {
      currentData = fullData;
    } else if (projectId && flowchartData) {
      currentData[projectId] = flowchartData;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid payload. Expected projectId and flowchartData' },
        { status: 400 }
      );
    }

    const saveResult = await saveFlowchartsData(currentData);

    return NextResponse.json({
      success: true,
      message: `Flowchart saved via ${saveResult.provider}`,
      provider: saveResult.provider,
      data: currentData,
    });
  } catch (error) {
    console.error('Error saving flowchart:', error);
    return NextResponse.json(
      { success: false, error: 'Server error saving flowchart data' },
      { status: 500 }
    );
  }
}
