'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { compressImage } from '@/lib/compress-image';

type Item = { id: string; file: File; url: string };

/**
 * Lets visitors pick up to `max` photos, shows previews, compresses them, and keeps the
 * real <input type="file" name="photos"> in sync so the photos travel with the normal form submit.
 */
export function PhotoPicker({ name = 'photos', max = 5 }: { name?: string; max?: number }) {
  const inputRef = useRef<HTMLInputElement>(null); // submitted with the form (synced from state)
  const pickerRef = useRef<HTMLInputElement>(null); // only opens the file dialog; never submitted
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // React resets the form after a submit; put the chosen files back if that happened.
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (input.files?.length !== items.length) {
      const dt = new DataTransfer();
      items.forEach((i) => dt.items.add(i.file));
      input.files = dt.files;
    }
  });

  useEffect(() => {
    return () => items.forEach((i) => URL.revokeObjectURL(i.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sync(next: Item[]) {
    const input = inputRef.current;
    if (input) {
      const dt = new DataTransfer();
      next.forEach((i) => dt.items.add(i.file));
      input.files = dt.files;
    }
    setItems(next);
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ''; // allow picking the same file again later
    if (picked.length === 0) return;
    setError('');

    const room = max - items.length;
    const images = picked.filter((f) => f.type.startsWith('image/'));
    if (images.length < picked.length) setError('Only image files can be attached.');
    if (images.length > room) setError(`You can attach up to ${max} photos.`);

    setBusy(true);
    const added: Item[] = [];
    for (const file of images.slice(0, Math.max(0, room))) {
      const small = await compressImage(file);
      added.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file: small, url: URL.createObjectURL(small) });
    }
    setBusy(false);
    sync([...items, ...added]);
  }

  function remove(id: string) {
    const target = items.find((i) => i.id === id);
    if (target) URL.revokeObjectURL(target.url);
    sync(items.filter((i) => i.id !== id));
  }

  return (
    <div>
      {/* Opens the dialog */}
      <input ref={pickerRef} type="file" accept="image/*" multiple className="sr-only" onChange={onPick} tabIndex={-1} aria-hidden="true" />
      {/* The input that is actually submitted with the form */}
      <input ref={inputRef} name={name} type="file" className="hidden" tabIndex={-1} aria-hidden="true" />

      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <div key={item.id} className="relative h-24 w-24 border border-gray-300 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={`Attached photo ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white hover:bg-red-600"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        ))}

        {items.length < max && (
          <button
            type="button"
            disabled={busy}
            onClick={() => pickerRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-400 text-xs text-gray-600 hover:border-red-600 hover:text-red-600 disabled:opacity-60"
          >
            <ImagePlus size={22} aria-hidden />
            {busy ? 'Processing…' : 'Add photos'}
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Optional. Up to {max} photos (logo, sketches, examples you like, products). Large photos are resized automatically.
      </p>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
