'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { saveProject, type ProjectFormState } from '@/server/actions/admin';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Card, inputClass, labelClass } from '@/components/admin/ui';

export type ProjectFormValues = {
  id?: number;
  title?: string;
  slug?: string;
  category?: string | null;
  summary?: string;
  description?: string;
  projectUrl?: string | null;
  coverImage?: string | null;
  gallery?: string[] | null;
  published?: boolean;
};

function SaveButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-red-600 px-6 py-3 text-sm font-semibold hover:bg-black disabled:opacity-60" style={{ color: '#fff' }}>
      {pending ? 'Saving…' : editing ? 'Save changes' : 'Create project'}
    </button>
  );
}

export function ProjectForm({ project }: { project?: ProjectFormValues }) {
  const editing = Boolean(project?.id);
  const [state, formAction] = useActionState<ProjectFormState, FormData>(saveProject.bind(null, project?.id ?? null), { message: '' });
  const err = (k: string) => state.errors?.[k]?.[0];

  return (
    <form action={formAction} className="space-y-6">
      {state.message && <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{state.message}</div>}

      <Card className="space-y-5 p-5 md:p-6">
        <h2 className="text-lg font-semibold">Photos</h2>
        <ImageUploader
          name="coverImage"
          label="Main photo (shown on the portfolio list)"
          initial={project?.coverImage ? [project.coverImage] : []}
          max={1}
          hint="JPG, PNG or WebP. Large photos are resized automatically before upload."
        />
        {err('coverImage') && <p className="text-sm text-red-600">{err('coverImage')}</p>}
        <ImageUploader
          name="gallery"
          label="More photos (gallery on the project page)"
          initial={project?.gallery ?? []}
          multiple
          max={12}
          hint="Up to 12 photos. Add product shots, screens or before/after images."
        />
      </Card>

      <Card className="space-y-5 p-5 md:p-6">
        <h2 className="text-lg font-semibold">Details</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>Title *</label>
            <input id="title" name="title" required defaultValue={project?.title} className={inputClass} />
            {err('title') && <p className="mt-1 text-sm text-red-600">{err('title')}</p>}
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <input id="category" name="category" defaultValue={project?.category ?? ''} placeholder="E-commerce, Website, Digital menu…" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>Link name</label>
          <input id="slug" name="slug" defaultValue={project?.slug} placeholder="Leave empty to create it from the title" className={inputClass} />
          <p className="mt-1 text-xs text-gray-500">Used in the web address: /portfolio/<em>link-name</em></p>
          {err('slug') && <p className="mt-1 text-sm text-red-600">{err('slug')}</p>}
        </div>

        <div>
          <label htmlFor="summary" className={labelClass}>Short summary *</label>
          <input id="summary" name="summary" required defaultValue={project?.summary} className={inputClass} />
          {err('summary') && <p className="mt-1 text-sm text-red-600">{err('summary')}</p>}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description *</label>
          <textarea id="description" name="description" rows={8} required defaultValue={project?.description} className={inputClass} />
          {err('description') && <p className="mt-1 text-sm text-red-600">{err('description')}</p>}
        </div>

        <div>
          <label htmlFor="projectUrl" className={labelClass}>Live project link</label>
          <input id="projectUrl" name="projectUrl" type="url" defaultValue={project?.projectUrl ?? ''} placeholder="https://" className={inputClass} />
          {err('projectUrl') && <p className="mt-1 text-sm text-red-600">{err('projectUrl')}</p>}
        </div>

        <label className="flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? false} className="h-4 w-4 accent-red-600" />
          Published (visible on the public portfolio)
        </label>
      </Card>

      <div className="flex items-center gap-4">
        <SaveButton editing={editing} />
        <Link href="/admin/portfolio" className="text-sm underline">Cancel</Link>
      </div>
    </form>
  );
}
