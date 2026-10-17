'use server';

import { db } from '@/db';
import { inquiries, portfolioProjects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const INQUIRY_STATUSES = ['new', 'reviewing', 'quoted', 'in_progress', 'completed', 'rejected'];

// Helper to enforce admin authorization
async function enforceAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function updateInquiryStatus(id: number, status: string) {
  await enforceAdmin();
  if (!INQUIRY_STATUSES.includes(status)) throw new Error('Invalid status');
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  revalidatePath('/admin/inquiries');
}

export async function togglePortfolioPublished(id: number, published: boolean) {
  await enforceAdmin();
  await db.update(portfolioProjects).set({ published }).where(eq(portfolioProjects.id, id));
  revalidatePath('/admin/portfolio');
  revalidatePath('/portfolio');
}

// In a real application we would have full CRUD actions for portfolio, services, FAQs, etc.
