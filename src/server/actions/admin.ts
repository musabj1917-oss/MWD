'use server';

import { z } from 'zod';
import { db } from '@/db';
import { botMessages, inquiries, inquiryNotes, portfolioProjects } from '@/db/schema';
import { BOT_DEFAULTS, validateBotText } from '@/lib/bot-fields';
import { validateFlow } from '@/lib/bot-flow-types';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const INQUIRY_STATUSES = ['new', 'reviewing', 'quoted', 'in_progress', 'completed', 'rejected'];

// Helper to enforce admin authorization
async function enforceAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function updateInquiryStatus(id: number, status: string) {
  await enforceAdmin();
  if (!INQUIRY_STATUSES.includes(status)) throw new Error('Invalid status');
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath('/admin');
}

export async function addInquiryNote(inquiryId: number, formData: FormData) {
  const session = await enforceAdmin();
  const note = String(formData.get('note') ?? '').trim().slice(0, 5000);
  if (!note) return;
  const userId = Number(session.user.id);
  await db.insert(inquiryNotes).values({
    inquiryId,
    note,
    createdBy: Number.isInteger(userId) ? userId : null,
  });
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function togglePortfolioPublished(id: number, published: boolean) {
  await enforceAdmin();
  await db.update(portfolioProjects).set({ published }).where(eq(portfolioProjects.id, id));
  revalidatePath('/admin/portfolio');
  revalidatePath('/admin');
  revalidatePath('/portfolio');
}

export async function deleteProject(id: number) {
  await enforceAdmin();
  await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  revalidatePath('/admin/portfolio');
  revalidatePath('/admin');
  revalidatePath('/portfolio');
  redirect('/admin/portfolio');
}

/* ---------- Portfolio project create / update (with photos) ---------- */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

// Photos are uploaded first through /api/admin/upload, so the form only carries their URLs.
const imageUrl = z.string().regex(/^\/api\/images\/[A-Za-z0-9_-]+$/, 'Invalid image');

const projectSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(200),
  slug: z.string().trim().max(80).optional(),
  category: z.string().trim().max(100).optional(),
  summary: z.string().trim().min(5, 'Add a short summary').max(500),
  description: z.string().trim().min(5, 'Add a description').max(10000),
  projectUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .refine((v) => !v || /^https?:\/\//i.test(v), 'Link must start with http:// or https://'),
  coverImage: imageUrl.optional(),
  gallery: z.array(imageUrl).max(12),
});

export type ProjectFormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export async function saveProject(
  id: number | null,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await enforceAdmin();

  const clean = (k: string) => {
    const v = formData.get(k);
    return typeof v === 'string' && v.trim() !== '' ? v : undefined;
  };

  const parsed = projectSchema.safeParse({
    title: formData.get('title') ?? '',
    slug: clean('slug'),
    category: clean('category'),
    summary: formData.get('summary') ?? '',
    description: formData.get('description') ?? '',
    projectUrl: clean('projectUrl'),
    coverImage: clean('coverImage'),
    gallery: formData.getAll('gallery').filter((v): v is string => typeof v === 'string' && v !== ''),
  });

  if (!parsed.success) {
    return { message: 'Please fix the highlighted fields.', errors: z.flattenError(parsed.error).fieldErrors };
  }

  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  if (!slug) return { message: 'Could not build a link name from the title.', errors: { slug: ['Enter a link name'] } };

  const published = formData.get('published') === 'on';
  const values = {
    title: d.title,
    slug,
    category: d.category ?? null,
    summary: d.summary,
    description: d.description,
    projectUrl: d.projectUrl ?? null,
    coverImage: d.coverImage ?? null,
    gallery: d.gallery,
    published,
  };

  try {
    if (id) {
      await db.update(portfolioProjects).set(values).where(eq(portfolioProjects.id, id));
    } else {
      await db.insert(portfolioProjects).values(values);
    }
  } catch (error) {
    const code = (error as { code?: string; cause?: { code?: string } })?.code ?? (error as { cause?: { code?: string } })?.cause?.code;
    if (code === '23505') {
      return { message: 'Another project already uses that link name.', errors: { slug: ['Already in use, choose another'] } };
    }
    console.error('Failed to save project', error);
    return { message: 'Could not save the project. Please try again.' };
  }

  revalidatePath('/admin/portfolio');
  revalidatePath('/admin');
  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${slug}`);
  redirect('/admin/portfolio');
}

/* ---------- Telegram bot messages ---------- */

export type BotMessageState = { ok: boolean; message: string };

export async function saveBotMessage(key: string, _prev: BotMessageState, formData: FormData): Promise<BotMessageState> {
  await enforceAdmin();
  if (!(key in BOT_DEFAULTS)) return { ok: false, message: 'Unknown message.' };
  const value = String(formData.get('value') ?? '').replace(/\r\n/g, '\n').trim();
  const error = validateBotText(key, value);
  if (error) return { ok: false, message: error };

  await db
    .insert(botMessages)
    .values({ key, value })
    .onConflictDoUpdate({ target: botMessages.key, set: { value, updatedAt: new Date() } });
  revalidatePath('/admin/bot');
  return { ok: true, message: 'Saved. The bot uses it right away.' };
}

export async function resetBotMessage(key: string, _prev: BotMessageState): Promise<BotMessageState> {
  await enforceAdmin();
  if (!(key in BOT_DEFAULTS)) return { ok: false, message: 'Unknown message.' };
  await db.delete(botMessages).where(eq(botMessages.key, key));
  revalidatePath('/admin/bot');
  return { ok: true, message: 'Restored the original text.' };
}

export async function saveFlow(_prev: BotMessageState, formData: FormData): Promise<BotMessageState> {
  await enforceAdmin();
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get('flow') ?? ''));
  } catch {
    return { ok: false, message: 'Could not read the flow. Please try again.' };
  }
  const result = validateFlow(parsed);
  if ('error' in result) return { ok: false, message: result.error };

  const value = JSON.stringify(result.flow);
  await db
    .insert(botMessages)
    .values({ key: 'flow', value })
    .onConflictDoUpdate({ target: botMessages.key, set: { value, updatedAt: new Date() } });
  revalidatePath('/admin/bot');
  revalidatePath('/admin/bot/flow');
  return { ok: true, message: 'Saved. The bot now follows this flow.' };
}

export async function resetFlow(_prev: BotMessageState): Promise<BotMessageState> {
  await enforceAdmin();
  await db.delete(botMessages).where(eq(botMessages.key, 'flow'));
  revalidatePath('/admin/bot');
  revalidatePath('/admin/bot/flow');
  return { ok: true, message: 'Back to the built-in bot.' };
}


/** Save the Telegram how-to video URL from the website admin dashboard. */
export type HowToVideoState = { ok: boolean; message: string };

export async function removeHowToVideo(_prev: HowToVideoState): Promise<HowToVideoState> {
  await enforceAdmin();
  try {
    await db.delete(botMessages).where(eq(botMessages.key, 'howto_video'));
    revalidatePath('/admin/video');
    return { ok: true, message: 'How-to video removed.' };
  } catch (error) {
    console.error('Could not remove Telegram how-to video:', error);
    return { ok: false, message: 'Could not remove the video. Please try again.' };
  }
}
