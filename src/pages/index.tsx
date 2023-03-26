import Head from 'next/head';
import styles from './home.module.scss';
import { SubscribeButton } from '@/components';
import { GetStaticProps } from 'next';
import { stripe } from '@/services';
import Image from 'next/image';

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

        <Image
          src='/images/avatar.svg'
          alt='Girl coding'
          width={334}
          height={520}
          priority
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
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
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
