import { signIn, signOut, useSession } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

export function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button
      className='flex h-12 items-center justify-center rounded-[3rem] border-0 bg-gray-850 px-6 font-bold text-white transition delay-200 hover:brightness-[0.8]'
      type='button'
      onClick={() => signOut()}
    >
      <FaGithub color='#04d361' className='mr-4 h-5 w-5' />
      {session.user?.name}
      <FiX className='ml-4' color='#737380' />
    </button>
  ) : (
    <button
      className='flex h-12 items-center justify-center rounded-[3rem] border-0 bg-gray-850 px-6 font-bold text-white transition delay-200 hover:brightness-[0.8]'
      type='button'
      onClick={() => signIn('github')}
    >
      <FaGithub color='#eba417' className='mr-4 h-5 w-5' />
      Sign in with GitHub
    </button>
  );
}
