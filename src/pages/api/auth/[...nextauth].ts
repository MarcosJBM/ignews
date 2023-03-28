import { fauna } from '@/services';
import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { query as q } from 'faunadb';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(user) {
      try {
        await fauna.query(
          q.Create(q.Collection('users'), { data: { email: user.user.email } })
        );

        return true;
      } catch {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
