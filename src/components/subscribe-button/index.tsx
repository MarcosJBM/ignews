import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';

import { api, getStripeJs } from '@/services';

import styles from './styles.module.scss';

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
      className={styles.subscribeButton}
      type='button'
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
