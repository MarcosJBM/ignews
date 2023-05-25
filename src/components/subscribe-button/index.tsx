import { signIn, useSession } from 'next-auth/react';
import styles from './styles.module.scss';
import { api, getStripeJs } from '@/services';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';

interface SubscribeButtonProps {
  priceId: string;
}

type CustomSession =
  | (Session & {
      activeSubscription: object | null;
    })
  | null;

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
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
