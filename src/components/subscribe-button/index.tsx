import { signIn, useSession } from 'next-auth/react';
import styles from './styles.module.scss';
import { api, getStripeJs } from '@/services';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) return signIn('github');

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
