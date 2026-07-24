import { NextResponse } from "next/server";
import { stat, readFile } from "node:fs/promises";
import { contentTypeFor, resolveUploadPath } from "@/lib/uploads";

// Serves admin-uploaded media from disk on every request.
//
// Next.js only serves files that were in `public/` when the server booted, so
// runtime uploads cannot live there — see the note in lib/uploads.ts. This
// handler covers the same `/uploads/<name>` URLs those files used to have.
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  const file = resolveUploadPath(segments);
  if (!file) return new NextResponse("Not found", { status: 404 });

  const contentType = contentTypeFor(file);
  if (!contentType) return new NextResponse("Not found", { status: 404 });

  let size: number;
  try {
    const info = await stat(file);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });
    size = info.size;
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = await readFile(file);

  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      // Upload filenames embed a timestamp + random suffix, so a given URL
      // always points at the same bytes and can be cached indefinitely.
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Security-Policy": "default-src 'self'; script-src 'none'; sandbox;",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
