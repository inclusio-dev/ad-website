import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'activities.json');

export async function GET() {
  const data = await fs.readFile(filePath, 'utf8');
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request: NextRequest) {
  const newActivity = await request.json();
  const data = await fs.readFile(filePath, 'utf8');
  const activities = JSON.parse(data);
  activities.push(newActivity);
  await fs.writeFile(filePath, JSON.stringify(activities, null, 2));
  return NextResponse.json({ success: true, activity: newActivity });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const data = await fs.readFile(filePath, 'utf8');
  const activities = JSON.parse(data);
  const updated = activities.filter((a: any) => a.title !== title);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
  return NextResponse.json({ success: true });
}
