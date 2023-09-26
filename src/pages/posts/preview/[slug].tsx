import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { RichText } from 'prismic-dom';
import { Fragment, useEffect } from 'react';

import { createClient } from '../../../../prismicio';

interface PostPreviewProps {
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

const THIRTY_MINUTES = 30 * 60;

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const customSession = session as CustomSession;

  useEffect(() => {
    if (customSession?.activeSubscription) router.push(`/posts/${post.slug}`);
  }, [customSession, post.slug, router]);

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
            className='mt-8 bg-gradient-to-b from-gray-100 bg-clip-text text-lg leading-8 text-gray-100 text-transparent [&_li]:mt-2 [&_p]:mt-6 [&_ul]:mt-6 [&_ul]:pl-6'
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className='mx-0 mb-8 mt-16 rounded-[100px] bg-gray-850 p-8 text-center text-xl font-bold'>
            Wanna continue reading?
            <Link className='ml-2 text-yellow-500 hover:underline' href='/'>
              Subscribe now 🤗
            </Link>
          </div>
        </article>
      </main>
    </Fragment>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
}) => {
  const { slug } = params as { slug: string };

  const client = createClient({ previewData });

  const document = await client.getByUID('post', slug);

  const post = {
    slug,
    title: RichText.asText(document.data.title),
    content: RichText.asHtml(document.data.content.slice(0, 3)),
    updatedAt: new Date(document.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return { props: { post }, revalidate: THIRTY_MINUTES };
};
