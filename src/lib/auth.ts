import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "./db";

const config = {
  pages: {
    signIn: "/login",
  },
  //   Following are the default session values
  //   session: {
  //     maxAge: 30 * 24 * 60 * 60, // 30 days
  //     strategy: "jwt",
  //   },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on every login attempt
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          console.log("User not found");
          return null;
        }
        const matched = await bcrypt.compare(password, user.hashedPassword);
        if (!matched) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  // Callbacks are used to handle response to user actions (e.g. login)
  callbacks: {
    authorized: async ({ request }) => {
      // runs on every request with middleware
      const isProtectedRoute = request.nextUrl.pathname.includes("/app");
      if (isProtectedRoute) {
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn } = NextAuth(config);
