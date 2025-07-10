import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import jwt from "jsonwebtoken";

const secretKey = process.env.secretkey;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account.provider === "google" || account.provider === "facebook") {
        console.log("logged in successfully");
        return true;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      // On initial sign in, add user info and generate JWT
      if (user) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: account?.provider,
        };
        // Generate JWT token
        token.accessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });
      }
      return token;
    },
    async session({ session, token }) {
      // Attach JWT token to session
      session.accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: secretKey,
});

export { handler as GET, handler as POST };

// Helper for API routes to verify JWT token
export function authenticateToken(req, res, next) {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
}