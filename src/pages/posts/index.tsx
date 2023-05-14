import Head from 'next/head';
import styles from './styles.module.scss';
import { GetStaticProps } from 'next';
import { createClient } from '../../../prismicio';
import { RichText } from 'prismic-dom';

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
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <a key={post.slug} href='#'>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.summary}</p>
            </a>
          ))}
        </div>
      </main>
    </>
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
        post.data.content.find((content: any) => content.type === 'paragraph')
          ?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  return {
    props: { posts },
  };
};
