import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';

import { stripe } from '@/services';

import { saveSubscription } from './_lib';

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async function webhooks(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const buf = await buffer(request);
    const secret = request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    if (!secret) return response.status(400).send('Secret not found');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, webhookSecret);

      const { type } = event;

      if (relevantEvents.has(type)) {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;
          }
          case 'checkout.session.completed': {
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            if (checkoutSession.subscription && checkoutSession.customer) {
              await saveSubscription(
                checkoutSession.subscription?.toString(),
                checkoutSession.customer?.toString(),
                true
              );
            }

            break;
          }
          default:
            throw new Error('Unhandled event');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
      }
    }

    response.json({ received: true });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}
