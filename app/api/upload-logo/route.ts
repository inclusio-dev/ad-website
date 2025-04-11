import { NextRequest, NextResponse } from "next/server";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

function normalizeFilename(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[àáâä]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9.-]/g, "");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Nessun file inviato." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = normalizeFilename(file.name);
  const folderPath = path.join(process.cwd(), "public", "sponsors");
  const filePath = path.join(folderPath, filename);

  mkdirSync(folderPath, { recursive: true });
  writeFileSync(filePath, new Uint8Array(buffer));

  return NextResponse.json({ success: true, filename });
}
