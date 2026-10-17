// Shared image validation. Never trust the browser-supplied MIME type: sniff the bytes.

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB per photo after client-side compression

export type ImageType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

export function detectImageType(buf: Buffer): ImageType | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  if (buf.subarray(0, 4).toString('ascii') === 'GIF8') return 'image/gif';
  return null;
}

export function extensionFor(type: string) {
  return type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : type === 'image/gif' ? 'gif' : 'jpg';
}

export async function readImageFile(file: File): Promise<
  { ok: true; buffer: Buffer; contentType: ImageType } | { ok: false; error: string }
> {
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: `${file.name || 'Photo'} is larger than 2 MB.` };
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = detectImageType(buffer);
  if (!contentType) return { ok: false, error: `${file.name || 'File'} is not a JPG, PNG, WebP or GIF image.` };
  return { ok: true, buffer, contentType };
}
