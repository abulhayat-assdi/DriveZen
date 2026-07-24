import path from "node:path";

// Where admin-uploaded media is written.
//
// This deliberately sits OUTSIDE `public/`. Next.js scans `public/` exactly
// once, when the server boots, and serves only the files it found then — see
// `publicFolderItems` in next/dist/server/lib/router-utils/filesystem.js. A
// file written into `public/` by a running server is therefore never served,
// which is why uploads used to 404 until the container was restarted.
//
// Instead the files live here and are streamed by app/uploads/[...path]/route.ts,
// which hits the disk on every request. Mount a persistent volume over this
// path in production so uploads survive redeploys.
export const UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(process.cwd(), "data", "uploads");

// Public URL prefix. Unchanged from when uploads lived in `public/uploads`, so
// image URLs already stored in the database keep resolving.
export const UPLOADS_URL_PREFIX = "/uploads";

const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
};

export function contentTypeFor(filename: string): string | null {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return CONTENT_TYPES[ext] ?? null;
}

/**
 * Resolve a request path (the `[...path]` segments) to an absolute file inside
 * UPLOADS_DIR, or null if it escapes the directory. Uploaded names are
 * generated server-side, but the URL is user-controlled — so this guards
 * against `..` traversal and absolute paths.
 */
export function resolveUploadPath(segments: string[]): string | null {
  if (segments.length === 0) return null;
  const joined = segments.join("/");
  if (joined.includes("\0")) return null;

  const target = path.resolve(UPLOADS_DIR, joined);
  const root = path.resolve(UPLOADS_DIR);
  if (target !== root && !target.startsWith(root + path.sep)) return null;

  return target;
}
