'use server';

import { z } from 'zod';
import { db } from '@/db';
import { inquiries } from '@/db/schema';
import { nanoid } from 'nanoid';
// import { sendEmail } from '@/lib/email'; // We will implement this later

const quoteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  serviceOfInterest: z.string().optional(),
  budgetRange: z.string().optional(),
  projectDescription: z.string().min(10, 'Please provide more details about your project'),
});

export async function submitQuoteRequest(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      serviceOfInterest: formData.get('serviceOfInterest'),
      budgetRange: formData.get('budgetRange'),
      projectDescription: formData.get('projectDescription'),
    };

    const validatedData = quoteSchema.parse(rawData);
    
    // Generate a unique reference
    const reference = `REF-${nanoid(8).toUpperCase()}`;

    await db.insert(inquiries).values({
      reference,
      ...validatedData,
    });

    // TODO: Send emails to admin and customer

    return { success: true, message: `Thank you! Your inquiry reference is ${reference}. We will contact you soon.`, reference };
  } catch (error) {
    if (error instanceof z.ZodError) {
       return { success: false, errors: error.flatten().fieldErrors, message: 'Please correct the errors in the form.' };
    }
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }
}
