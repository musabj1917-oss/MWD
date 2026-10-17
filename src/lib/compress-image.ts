// Browser-only helper. Shrinks phone photos (often 4-10 MB) before upload so they fit
// hosting request limits and load quickly.

async function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

export async function compressImage(file: File, maxBytes = 700 * 1024): Promise<File> {
  // Leave GIFs alone (re-encoding would drop the animation) and anything that is not an image
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;

  try {
    const bitmap = await createImageBitmap(file);
    let maxSide = 1600;
    let quality = 0.82;

    for (let attempt = 0; attempt < 5; attempt++) {
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.fillStyle = '#ffffff'; // flatten transparency (PNG) onto white
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const blob = await toBlob(canvas, quality);
      if (!blob) return file;
      if (blob.size <= maxBytes || attempt === 4) {
        bitmap.close();
        const name = file.name.replace(/\.[^.]+$/, '') || 'photo';
        // If compression somehow made it bigger, keep the original
        if (blob.size >= file.size && file.size <= maxBytes) return file;
        return new File([blob], `${name}.jpg`, { type: 'image/jpeg' });
      }
      quality -= 0.1;
      maxSide = Math.round(maxSide * 0.8);
    }
    return file;
  } catch {
    return file;
  }
}
