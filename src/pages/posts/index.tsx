import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { Fragment } from 'react';

import { createClient } from '../../../prismicio';

interface PostProps {
  slug: string | null;
  title: string;
  summary: string;
  updatedAt: string;
}

interface PostsProps {
  posts: PostProps[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <Fragment>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className='mx-auto max-w-6xl px-8 py-0'>
        <div className='mx-auto mt-20 max-w-3xl'>
          {posts.map(post => (
            <Link
              className='mt-8 block border-t border-solid border-gray-700 pt-8 first:border-0'
              key={post.slug}
              href={`/posts/${post.slug}`}
            >
              <time className='flex items-center text-base text-gray-300'>
                {post.updatedAt}
              </time>

              <strong className='mt-4 block text-2xl leading-8 transition duration-200 hover:text-yellow-500'>
                {post.title}
              </strong>

              <p className='mt-2 leading-[1.625rem] text-gray-300'>
                {post.summary}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </Fragment>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData });

  const documents = await client.getByType('post');

  const posts = documents.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      summary:
        post.data.content.find(
          (content: { type: string }) => content.type === 'paragraph',
        )?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      ),
    };
  });

  return { props: { posts } };
};
