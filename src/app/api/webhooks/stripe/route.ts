import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') as string;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET in environment variables.');
      return new NextResponse('Configuration Error: Missing Webhook Secret', { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed.`, error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderReference = session.client_reference_id;
        
        if (orderReference) {
           await db.update(orders)
             .set({ status: 'paid', paymentIntentId: session.payment_intent as string })
             .where(eq(orders.reference, orderReference));
           console.log(`Order ${orderReference} marked as paid.`);
        }
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
     console.error('Error processing webhook event', error);
     return new NextResponse('Internal Error', { status: 500 });
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
