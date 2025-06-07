// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  })
  ],
  callbacks: {
    async signIn({ account }) {
      if (account.provider === "google" || account.provider == 'facebook') {
        console.log("logged in successfully");
        return true;
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
