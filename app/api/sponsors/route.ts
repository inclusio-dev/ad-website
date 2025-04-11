import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "sponsors.json");

export async function POST(req: NextRequest) {
  const body = await req.json();
  let sponsors = [];

  if (fs.existsSync(filePath)) {
    sponsors = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  sponsors.push(body);
  fs.writeFileSync(filePath, JSON.stringify(sponsors, null, 2));

  return NextResponse.json({ success: true, sponsor: body });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Missing sponsor name" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "data", "sponsors.json");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const data = fs.readFileSync(filePath, "utf-8");
  const sponsors = JSON.parse(data);

  const updated = sponsors.filter((s: any) => s.name !== name);

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

  return NextResponse.json({ success: true });
}
