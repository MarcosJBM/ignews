import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='pt-BR'>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap'
          rel='stylesheet'
        />
        <link rel='shortcut icon' href='/favicon.png' type='image/png' />
      </Head>

      <body className='bg-gray-900 text-white'>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
