import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { RichText } from 'prismic-dom';
import { Fragment } from 'react';

import { createClient } from '../../../prismicio';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

type CustomSession =
  | (Session & {
      activeSubscription: object | null;
    })
  | null;

export default function Post({ post }: PostProps) {
  return (
    <Fragment>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className='mx-auto my-0 max-w-6xl px-8 py-0'>
        <article className='mx-auto mt-20 max-w-3xl'>
          <h1 className='text-[3.5rem] font-black'>{post.title}</h1>

          <time className='mt-6 block text-base text-gray-300'>
            {post.updatedAt}
          </time>

          <div
            className='mt-8 text-lg leading-8 text-gray-100 [&_li]:mt-2 [&_p]:mt-6 [&_ul]:mt-6 [&_ul]:pl-6'
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  previewData,
}) => {
  const session = (await getSession({ req })) as CustomSession;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { slug } = params as { slug: string };

  const client = createClient({ previewData });

  const document = await client.getByUID('post', slug);

  const post = {
    slug,
    title: RichText.asText(document.data.title),
    content: RichText.asHtml(document.data.content),
    updatedAt: new Date(document.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return { props: { post } };
};
