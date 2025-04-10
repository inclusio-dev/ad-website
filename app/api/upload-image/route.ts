import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Utility per ottenere il buffer dal FormData
async function getFileBuffer(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
        throw new Error("Nessun file ricevuto");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    return { file, buffer };
}

export async function POST(req: NextRequest) {
    try {
        const { file, buffer } = await getFileBuffer(req);

        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });

        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(uploadsDir, filename);

        await fs.writeFile(filepath, buffer);

        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({
            success: 1,
            file: {
                url: fileUrl,
            },
        });
    } catch (err) {
        console.error("Errore nel caricamento immagine:", err);
        return NextResponse.json(
            { success: 0, message: "Errore nel caricamento" },
            { status: 500 }
        );
    }
}
