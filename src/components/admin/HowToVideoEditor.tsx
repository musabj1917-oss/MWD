'use client';

import { useActionState, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Upload } from 'lucide-react';
import { removeHowToPhotos, removeHowToVideo, type HowToVideoState } from '@/server/actions/admin';

const CHUNK = 3 * 1024 * 1024;
const MAX_VIDEO_BYTES = 16 * CHUNK;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_PHOTOS = 10;

type Status = { ok: boolean; message: string } | null;

export function HowToVideoEditor({
  hasVideo,
  isLink,
  photoCount,
  chatReady,
}: {
  hasVideo: boolean;
  isLink: boolean;
  photoCount: number;
  chatReady: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [names, setNames] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [videoState, removeVideoAction, removingVideo] = useActionState<HowToVideoState, FormData>(
    async (prev) => removeHowToVideo(prev),
    { ok: false, message: '' },
  );
  const [photoState, removePhotosAction, removingPhotos] = useActionState<HowToVideoState, FormData>(
    async (prev) => removeHowToPhotos(prev),
    { ok: false, message: '' },
  );

  async function upload() {
    const files = Array.from(fileRef.current?.files ?? []);
    if (!files.length) return setStatus({ ok: false, message: 'Choose a video or photos first.' });
    const videos = files.filter((f) => f.type.startsWith('video/'));
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (videos.length + images.length !== files.length) return setStatus({ ok: false, message: 'Only videos and photos are allowed.' });
    if (videos.length > 1) return setStatus({ ok: false, message: 'Choose one video (you can add several photos).' });
    if (images.length > MAX_PHOTOS) return setStatus({ ok: false, message: `You can add up to ${MAX_PHOTOS} photos.` });
    if (videos.some((f) => f.size > MAX_VIDEO_BYTES)) return setStatus({ ok: false, message: 'The video is too big. The maximum is 48 MB.' });
    if (images.some((f) => f.size > MAX_PHOTO_BYTES)) return setStatus({ ok: false, message: 'A photo is too big. The maximum is 10 MB each.' });

    const queue = [...videos, ...images];
    const totalChunks = queue.reduce((sum, f) => sum + Math.max(1, Math.ceil(f.size / CHUNK)), 0);
    let done = 0;

    setBusy(true);
    setSending(false);
    setProgress(0);
    setStatus(null);
    try {
      for (const file of queue) {
        const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
        const chunks = Math.max(1, Math.ceil(file.size / CHUNK));
        const replace = file === images[0];
        for (let i = 0; i < chunks; i++) {
          setSending(i === chunks - 1);
          const qs = new URLSearchParams({
            id,
            index: String(i),
            total: String(chunks),
            type: file.type,
            name: file.name,
            replace: replace ? '1' : '0',
          });
          const res = await fetch(`/api/admin/howto-video?${qs}`, { method: 'POST', body: file.slice(i * CHUNK, (i + 1) * CHUNK) });
          const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
          if (!res.ok || !data?.ok) throw new Error(data?.message || 'Upload failed. Please try again.');
          done += 1;
          setProgress(Math.round((done / totalChunks) * 100));
        }
      }
      const parts = [videos.length ? 'video' : '', images.length ? `${images.length} photo${images.length > 1 ? 's' : ''}` : ''].filter(Boolean);
      setStatus({ ok: true, message: `Uploaded ${parts.join(' and ')}. It now opens first when someone sends /start.` });
      if (fileRef.current) fileRef.current.value = '';
      setNames([]);
      router.refresh();
    } catch (error) {
      setStatus({ ok: false, message: error instanceof Error ? error.message : 'Upload failed. Please try again.' });
    } finally {
      setBusy(false);
      setSending(false);
    }
  }

  const removeBtn = 'inline-flex items-center gap-2 text-sm underline disabled:opacity-50';

  return (
    <div className="space-y-6">
      <section className="border border-gray-300 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-semibold">Current how-to</h2>
        </div>
        <div className="space-y-4 p-5 text-sm">
          {!hasVideo && photoCount === 0 && <p className="text-gray-600">Nothing yet. Upload a video or photos below.</p>}
          {hasVideo && (
            <div className="space-y-2">
              <p>
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-wider text-red-600">Video</span>
                {isLink ? 'A video link is saved (older setup). Uploading a new video replaces it.' : 'A how-to video is active.'}
              </p>
              <form action={removeVideoAction}>
                <button type="submit" disabled={removingVideo} className={removeBtn} style={{ color: 'inherit' }}>
                  <Trash2 size={14} aria-hidden /> {removingVideo ? 'Removing…' : 'Remove the video'}
                </button>
                {videoState.message && <p className={`mt-2 ${videoState.ok ? 'text-green-700' : 'text-red-700'}`}>{videoState.message}</p>}
              </form>
            </div>
          )}
          {photoCount > 0 && (
            <div className="space-y-2">
              <p>
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-wider text-red-600">Photos</span>
                {photoCount} photo{photoCount > 1 ? 's' : ''} active.
              </p>
              <form action={removePhotosAction}>
                <button type="submit" disabled={removingPhotos} className={removeBtn} style={{ color: 'inherit' }}>
                  <Trash2 size={14} aria-hidden /> {removingPhotos ? 'Removing…' : 'Remove the photos'}
                </button>
                {photoState.message && <p className={`mt-2 ${photoState.ok ? 'text-green-700' : 'text-red-700'}`}>{photoState.message}</p>}
              </form>
            </div>
          )}
        </div>
      </section>

      <section className="border border-gray-300 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-semibold">Upload new how-to video or photos</h2>
          <p className="text-sm text-gray-600">
            One video (MP4 works best, up to 48 MB) and/or up to 10 photos (10 MB each). A new video replaces the current video, and new photos replace the current photos.
          </p>
        </div>
        <div className="space-y-4 p-5">
          {!chatReady && (
            <p className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              One-time setup: open your bot in Telegram and send <code>/admin</code> followed by your admin password. Then come back here and upload.
            </p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="video/*,image/*"
            multiple
            disabled={busy}
            onChange={(e) => setNames(Array.from(e.target.files ?? []).map((f) => f.name))}
            className="block w-full border border-gray-300 bg-white p-3 text-sm file:mr-3 file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          {names.length > 0 && <p className="break-words text-xs text-gray-500">{names.length} selected: {names.join(', ')}</p>}
          {busy && (
            <div>
              <div className="h-2 w-full bg-gray-200">
                <div className="h-2 bg-red-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-gray-600">{sending && progress < 100 ? 'Sending to Telegram…' : `Uploading… ${progress}%`}</p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={upload}
              disabled={busy || names.length === 0}
              className="inline-flex items-center gap-2 bg-black px-5 py-2.5 text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
              style={{ color: '#fff' }}
            >
              <Upload size={16} aria-hidden /> {busy ? 'Uploading…' : 'Upload'}
            </button>
            {status && <p className={`text-sm ${status.ok ? 'text-green-700' : 'text-red-700'}`}>{status.message}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
