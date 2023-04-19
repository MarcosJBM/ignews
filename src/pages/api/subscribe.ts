import { fauna, stripe } from '@/services';
import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface User {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
}

export default async function subscribe(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const session = await getSession({ req: request });

    if (session && session.user?.email) {
      const user = await fauna.query<User>(
        q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email)))
      );

      let customerId = user.data.stripe_customer_id;

      if (!customerId) {
        const stripeCustomer = await stripe.customers.create({
          email: session.user.email,
        });

        await fauna.query(
          q.Update(q.Ref(q.Collection('users'), user.ref.id), {
            data: { stripe_customer_id: stripeCustomer.id },
          })
        );

        customerId = stripeCustomer.id;
      }

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
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
