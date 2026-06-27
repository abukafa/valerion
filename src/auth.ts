import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.role = u.role as string;
        token.isVerified = u.isVerified as boolean;
      }

      // If user logged in with Google, we should ensure they exist in our DB
      if (account?.provider === "google" && token.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        });
        
        if (!dbUser) {
          // Auto-register Google user
          dbUser = await prisma.user.create({
            data: {
              email: token.email,
              name: token.name || "Google User",
              image: (token.picture as string) || null,
              isVerified: false,
              role: "USER"
            }
          });
        } else if (token.picture && dbUser.image !== token.picture) {
          // Update profile picture if it changed
          dbUser = await prisma.user.update({
            where: { email: token.email },
            data: { image: token.picture as string }
          });
        }
        
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.isVerified = dbUser.isVerified;
        token.picture = dbUser.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isVerified = token.isVerified as boolean;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
