'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { compressImage } from '@/lib/compress-image';

/**
 * Uploads photos to /api/admin/upload as soon as they are chosen and keeps their URLs in hidden
 * inputs (`name`), so saving the surrounding form stores the photos with the project.
 */
export function ImageUploader({
  name,
  initial = [],
  multiple = false,
  max = 1,
  label,
  hint,
}: {
  name: string;
  initial?: string[];
  multiple?: boolean;
  max?: number;
  label: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState('');

  async function uploadOne(file: File): Promise<string | null> {
    const small = await compressImage(file, 900 * 1024);
    const body = new FormData();
    body.append('file', small);
    const res = await fetch('/api/admin/upload', { method: 'POST', body });
    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !json.url) {
      setError(json.error || (res.status === 401 ? 'Your session expired. Sign in again.' : 'Upload failed. Please try again.'));
      return null;
    }
    return json.url;
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    e.target.value = '';
    if (picked.length === 0) return;
    setError('');

    const room = max - urls.length;
    const batch = picked.slice(0, Math.max(0, room));
    if (picked.length > room) setError(`You can add up to ${max} photo${max === 1 ? '' : 's'} here.`);

    setBusy((n) => n + batch.length);
    const added: string[] = [];
    for (const file of batch) {
      const url = await uploadOne(file);
      if (url) added.push(url);
      setBusy((n) => n - 1);
    }
    setUrls((prev) => [...prev, ...added]);
  }

  return (
    <div>
      <span className="block text-sm font-medium text-gray-800 mb-1">{label}</span>
      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}

      <div className="flex flex-wrap gap-3">
        {urls.map((u) => (
          <div key={u} className="relative h-28 w-28 border border-gray-300 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setUrls((prev) => prev.filter((x) => x !== u))}
              aria-label="Remove photo"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white hover:bg-red-600"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        ))}

        {Array.from({ length: busy }).map((_, i) => (
          <div key={`busy-${i}`} className="flex h-28 w-28 items-center justify-center border border-gray-300 bg-gray-50 text-gray-500">
            <Loader2 className="animate-spin" size={22} aria-label="Uploading" />
          </div>
        ))}

        {urls.length + busy < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-28 w-28 flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-400 text-xs text-gray-600 hover:border-red-600 hover:text-red-600"
          >
            <ImagePlus size={24} aria-hidden />
            {multiple ? 'Add photos' : urls.length ? 'Replace' : 'Add photo'}
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onPick} />
      {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
