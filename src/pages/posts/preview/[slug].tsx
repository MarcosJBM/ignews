import { GetStaticPaths, GetStaticProps } from 'next';
import { createClient } from '../../../../prismicio';
import { RichText } from 'prismic-dom';
import Head from 'next/head';

import styles from '../post.module.scss';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Session } from 'next-auth';

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
  }, [customSession]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href='/'>Subscribe now 🤗</Link>
          </div>
        </article>
      </main>
    </>
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
      }
    ),
  };

  return { props: { post }, revalidate: THIRTY_MINUTES };
};
