import Image from 'next/image';

import { SignInButton } from '../sign-in-button';

import styles from './styles.module.scss';
import { ActiveLink } from '../active-link';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
          src='/images/logo.svg'
          alt='ig.news'
          width={110}
          height={32}
          priority
        />

        <nav>
          <ActiveLink
            activeClassName={styles.active}
            href='/'
            pageName='Home'
          />

          <ActiveLink
            activeClassName={styles.active}
            href='/posts'
            pageName='Posts'
          />
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
