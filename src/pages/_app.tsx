import '../styles/global.css';

import { PrismicPreview } from '@prismicio/next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { Header } from '@/components';

import { repositoryName } from '../../prismicio';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <PrismicPreview repositoryName={repositoryName}>
      <SessionProvider session={session}>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </PrismicPreview>
  );
}
