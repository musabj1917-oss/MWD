'use client';

import { useActionState, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Upload } from 'lucide-react';
import { removeHowToVideo, type HowToVideoState } from '@/server/actions/admin';

const CHUNK = 3 * 1024 * 1024;
const MAX_BYTES = 16 * CHUNK;

type Status = { ok: boolean; message: string } | null;

export function HowToVideoEditor({ hasVideo, isLink, chatReady }: { hasVideo: boolean; isLink: boolean; chatReady: boolean }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [removeState, removeAction, removing] = useActionState<HowToVideoState, FormData>(
    async (prev) => removeHowToVideo(prev),
    { ok: false, message: '' },
  );

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return setStatus({ ok: false, message: 'Choose a video first.' });
    if (!file.type.startsWith('video/')) return setStatus({ ok: false, message: 'That is not a video file.' });
    if (file.size > MAX_BYTES) return setStatus({ ok: false, message: 'The video is too big. The maximum is 48 MB.' });

    setBusy(true);
    setSending(false);
    setProgress(0);
    setStatus(null);
    const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    const total = Math.max(1, Math.ceil(file.size / CHUNK));
    try {
      for (let i = 0; i < total; i++) {
        if (i === total - 1) setSending(true);
        const qs = new URLSearchParams({ id, index: String(i), total: String(total), type: file.type, name: file.name });
        const res = await fetch(`/api/admin/howto-video?${qs}`, { method: 'POST', body: file.slice(i * CHUNK, (i + 1) * CHUNK) });
        const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
        if (!res.ok || !data?.ok) throw new Error(data?.message || 'Upload failed. Please try again.');
        setProgress(Math.round(((i + 1) / total) * 100));
        if (i === total - 1) setStatus({ ok: true, message: data.message || 'Uploaded.' });
      }
      if (fileRef.current) fileRef.current.value = '';
      setFileName('');
      router.refresh();
    } catch (error) {
      setStatus({ ok: false, message: error instanceof Error ? error.message : 'Upload failed. Please try again.' });
    } finally {
      setBusy(false);
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="border border-gray-300 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-semibold">
            Current video{' '}
            {hasVideo && <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider text-red-600">Active</span>}
          </h2>
        </div>
        <div className="space-y-3 p-5 text-sm">
          {hasVideo ? (
            <p>{isLink ? 'A video link is saved (older setup). Uploading a new video replaces it.' : 'A how-to video is active. The bot sends it first when someone sends /start.'}</p>
          ) : (
            <p className="text-gray-600">No how-to video yet. Upload one below.</p>
          )}
          {hasVideo && (
            <form action={removeAction}>
              <button type="submit" disabled={removing} className="inline-flex items-center gap-2 text-sm underline disabled:opacity-50" style={{ color: 'inherit' }}>
                <Trash2 size={14} aria-hidden /> {removing ? 'Removing…' : 'Remove the video'}
              </button>
              {removeState.message && <p className={`mt-2 text-sm ${removeState.ok ? 'text-green-700' : 'text-red-700'}`}>{removeState.message}</p>}
            </form>
          )}
        </div>
      </section>

      <section className="border border-gray-300 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-semibold">Upload new how-to video</h2>
          <p className="text-sm text-gray-600">Choose a video from your phone (MP4 works best, up to 48 MB). It replaces the current one.</p>
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
            accept="video/*"
            disabled={busy}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
            className="block w-full border border-gray-300 bg-white p-3 text-sm file:mr-3 file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          {fileName && <p className="truncate text-xs text-gray-500">{fileName}</p>}
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
              disabled={busy || !fileName}
              className="inline-flex items-center gap-2 bg-black px-5 py-2.5 text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
              style={{ color: '#fff' }}
            >
              <Upload size={16} aria-hidden /> {busy ? 'Uploading…' : 'Upload video'}
            </button>
            {status && <p className={`text-sm ${status.ok ? 'text-green-700' : 'text-red-700'}`}>{status.message}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
