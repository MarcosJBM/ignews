import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Fragment } from 'react';

import { SubscribeButton } from '@/components';
import { stripe } from '@/services';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

const TWENTY_FOUR_HOURS = 60 * 60 * 24;

export default function Home({ product }: HomeProps) {
  return (
    <Fragment>
      <Head>
        <title>ig.news</title>
      </Head>

      <main className='mx-auto flex h-[calc(100vh-5rem)] max-w-6xl items-center justify-between px-8 py-0'>
        <section className='max-w-[600px]'>
          <span className='text-2xl font-bold'>👏 Hey, welcome</span>

          <h1 className='mt-10 text-7xl font-black'>
            News about the <span className='text-cyan-500'>React</span> world.
          </h1>

          <p className='mb-10 mt-6 text-2xl leading-9'>
            Get access to all the publications <br />
            <span className='font-bold text-cyan-500'>
              for {product.amount} month
            </span>
          </p>

          <SubscribeButton />
        </section>

        <Image
          src='/images/avatar.svg'
          alt='Girl coding'
          width={334}
          height={520}
          priority
        />
      </main>
    </Fragment>
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

  return { props: { product }, revalidate: TWENTY_FOUR_HOURS };
};
