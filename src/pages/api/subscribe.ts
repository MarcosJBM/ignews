import { stripe } from '@/services';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function subscribe(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const session = await getSession({ req: request });

    if (session && session.user?.email) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomer.id,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [{ price: 'price_1MpeQ6IxgNCujPqX7M1qTCGf', quantity: 1 }],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL as string,
        cancel_url: process.env.STRIPE_CANCEL_URL as string,
      });

      return response.status(200).json({ sessionId: stripeCheckoutSession.id });
    }

    response.status(400).end('Bad Request');
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method Not Allowed');
  }
}
