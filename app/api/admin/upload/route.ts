import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

// Formats we re-encode to a resized, compressed WebP for fast loading.
// SVG (vector) and GIF (may be animated) are stored as-is.
const RASTER_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ ok: false, error: "No file received" }, { status: 400 });

  const ext = EXT[file.type];
  if (!ext)
    return NextResponse.json(
      { ok: false, error: "Only JPG, PNG, WEBP, GIF, SVG, AVIF are allowed" },
      { status: 400 }
    );

  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ ok: false, error: "Maximum upload size is 5MB" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());

  let outBuffer: Buffer = bytes;
  let outExt = ext;

  if (RASTER_TYPES.has(file.type)) {
    try {
      outBuffer = await sharp(bytes)
        .rotate() // apply EXIF orientation, then strip metadata
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      outExt = "webp";
    } catch {
      // fall back to the original file if processing fails
      outBuffer = bytes;
      outExt = ext;
    }
  }

  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${outExt}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), outBuffer);

  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
