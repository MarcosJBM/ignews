import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';

import { api, getStripeJs } from '@/services';

type CustomSession =
  | (Session & {
      activeSubscription: object | null;
    })
  | null;

export function SubscribeButton() {
  const { data: session } = useSession();

  const router = useRouter();

  const customSession = session as CustomSession;

  async function handleSubscribe() {
    if (!customSession) return signIn('github');

    if (customSession.activeSubscription) return router.push('/posts');

    try {
      const { data } = await api.post('/subscribe');

      const stripe = await getStripeJs();

      if (stripe) {
        await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
      } else {
        alert('Não foi possível realizar a assinatura!');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  return (
    <button
      className='flex h-16 w-64 items-center justify-center rounded-[2rem] border-0 bg-yellow-500 text-xl font-bold text-gray-900 transition delay-200 hover:brightness-[0.8]'
      type='button'
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
