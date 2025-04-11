export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error("❌ Nessun file ricevuto");
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log("📦 File ricevuto:", file.name, file.type, file.size);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = file.name.replace(/\s+/g, '-').toLowerCase();
    const filePath = path.join(process.cwd(), 'public', 'activities', filename);

    console.log("📁 Scrivendo su:", filePath);

    await writeFile(filePath, new Uint8Array(buffer));

    console.log("✅ Scrittura completata");
    return NextResponse.json({ success: true, filename });

  } catch (error) {
    console.error("🔥 Errore in upload API:", error);
    return NextResponse.json({ error: 'Errore scrittura file' }, { status: 500 });
  }
}
