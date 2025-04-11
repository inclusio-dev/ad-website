import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'sponsors.json');

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Leggi i dati esistenti
  let sponsors = [];
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    sponsors = JSON.parse(fileContents);
  }

  // Aggiungi il nuovo sponsor
  sponsors.push(body);

  // Scrivi sul file
  fs.writeFileSync(filePath, JSON.stringify(sponsors, null, 2));

  return NextResponse.json({ success: true, sponsor: body });
}
