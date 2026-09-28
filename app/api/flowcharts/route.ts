import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'data', 'flowcharts.json');

export async function GET() {
  try {
    const filePath = getFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    const flowcharts = JSON.parse(data);
    return NextResponse.json(flowcharts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read flowchart data' }, { status: 500 });
  }
}
