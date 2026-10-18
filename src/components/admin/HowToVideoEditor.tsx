'use client';

import { useActionState } from 'react';
import { saveHowToVideo, type HowToVideoState } from '@/server/actions/admin';

const initialState: HowToVideoState = { ok: false, message: '' };

export function HowToVideoEditor({ initialUrl }: { initialUrl: string }) {
  const [state, action, pending] = useActionState(saveHowToVideo, initialState);
  return (
    <section className="border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Telegram how-to video</h2>
      <p className="mt-2 text-sm text-gray-600">
        Manage the tutorial video sent inside the Telegram bot when users send /start. Changes are made here in the website admin only.
        Use a direct public MP4 video URL that Telegram can fetch.
      </p>
      {!initialUrl && (
        <p className="mt-3 rounded bg-amber-50 p-3 text-sm text-amber-900">
          No Telegram how-to video URL is saved yet. Add a direct public video URL here.
        </p>
      )}
      <form action={action} className="mt-4 space-y-3">
        <label htmlFor="videoUrl" className="block text-sm font-medium">Direct video URL</label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          defaultValue={initialUrl}
          placeholder="https://example.com/video.mp4"
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={pending} className="bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {pending ? 'Saving…' : 'Save Telegram video'}
          </button>
          <button type="submit" name="removeVideo" value="1" disabled={pending} className="border border-gray-300 px-4 py-2 text-sm disabled:opacity-50">
            Remove video
          </button>
        </div>
        {state.message && <p role="status" className={state.ok ? 'text-sm text-green-700' : 'text-sm text-red-700'}>{state.message}</p>}
      </form>
    </section>
  );
}
