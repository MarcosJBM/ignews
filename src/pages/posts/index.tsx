import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {[1, 2, 3].map(key => (
            <a key={key.toString()} href='#'>
              <time>12 de março de 2023</time>

              <strong>
                Do back ao mobile: de onde surgiu a programação fullstack
              </strong>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
                odit, reiciendis libero ad dolorum quo iusto, odio aut neque
                optio vel voluptatibus? Autem optio tempora mollitia, a minus
                aperiam earum.
              </p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
