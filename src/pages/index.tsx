import Head from 'next/head';
import styles from './home.module.scss';
import { SubscribeButton } from '@/components';
import { GetServerSideProps } from 'next';
import { stripe } from '@/services';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}
export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>
            News about the <span>React</span> world.
          </h1>

          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src='/images/avatar.svg' alt='Girl coding' />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1MpeQ6IxgNCujPqX7M1qTCGf');

  const unitAmount = price.unit_amount ? price.unit_amount / 100 : 0;

  const formattedUnitAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(unitAmount);

  const product = {
    priceId: price.id,
    amount: formattedUnitAmount,
  };

  return {
    props: {
      product,
    },
  };
};
