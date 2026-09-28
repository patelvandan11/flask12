import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'data', 'flowcharts.json');

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin session
    const adminCookie = req.cookies.get('admin_session');
    if (adminCookie?.value !== 'authenticated_token_2026') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    // 2. Parse payload
    const body = await req.json();
    const { projectId, flowchartData, fullData } = body;

    const filePath = getFilePath();
    let currentData: Record<string, any> = {};

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      currentData = JSON.parse(fileContent);
    } catch {
      currentData = {};
    }

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

    // 3. Write back to data/flowcharts.json
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Flowchart data saved successfully',
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
