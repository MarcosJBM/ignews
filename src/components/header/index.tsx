import Image from 'next/image';

import { ActiveLink } from '../active-link';
import { SignInButton } from '../sign-in-button';

export function Header() {
  return (
    <header className='h-20 border-b border-solid border-b-gray-800 [&_button]:ml-auto'>
      <div className='mx-auto my-0 flex h-20 max-w-6xl items-center px-8 py-0'>
        <Image
          src='/images/logo.svg'
          alt='ig.news'
          width={110}
          height={32}
          priority
        />

        <nav className='ml-20 h-20'>
          <ActiveLink href='/' pageName='Home' />

          <ActiveLink href='/posts' pageName='Posts' />
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
