import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { createClient } from '../../../prismicio';
import { RichText } from 'prismic-dom';
import Head from 'next/head';

import styles from './post.module.scss';
import { Session } from 'next-auth';

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
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>

          <time>{post.updatedAt}</time>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
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
      }
    ),
  };

  return { props: { post } };
};
