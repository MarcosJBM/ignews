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
      if (!user.user.email) return false;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(user.user.email))
              )
            ),
            q.Create(q.Collection('users'), {
              data: { email: user.user.email },
            }),
            q.Get(
              q.Match(q.Index('user_by_email'), q.Casefold(user.user.email))
            )
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
