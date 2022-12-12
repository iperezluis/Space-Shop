import NextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";
import SpotifyProvider from "next-auth/providers/spotify";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication provider
  providers: [
    Credentials({
      name: "Custom Login",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "email@google.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      //if we changes the role of one user to admin since the database then that user should logout and again login because the info of that user is storage in token that coming of NexthAuth
      async authorize(credentials) {
        console.log(credentials);

        return await dbUsers.checkEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),

    // ...add twitter provider
  ],
  secret: process.env.NEXTAUTH_SECRET,
  //custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  jwt: {
    // secret: process.env.SECRET_KEY_JWT deprecated
  },
  //session time config
  session: {
    maxAge: 2592000, //30 days,
    strategy: "jwt",
    updateAge: 86400, // every day
  },

  //callbacks for sessions
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accesToken = account.access_token;
      }
      switch (account?.type) {
        case "oauth":
          token.user = await dbUsers.oAuthToDB(
            user?.email || "",
            user?.name || ""
          );

          break;
        case "credentials":
          token.user = user;
          break;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accesToken = token.accesToken;
      session.user = token.user as any; //to check
      return session;
    },
  },
});
