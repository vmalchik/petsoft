import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
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
    // NextAuth will encrypt the token
    Credentials({
      async authorize(credentials) {
        try {
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

          return user; // NextAuth will filter out certain user properties such as password
        } catch (e) {
          console.log("Authorize Exception", e);
        }

        return null;
      },
    }),
  ],
  // Callbacks are used to handle response to user actions (e.g. login)
  callbacks: {
    authorized: async ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user?.email); // Provided by next-auth. Value is equal to return of authorize function
      const isProtectedRoute = request.nextUrl.pathname.includes("/app");
      console.log(auth);
      // explicit allow list
      if (isLoggedIn && !isProtectedRoute) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }
      if (isLoggedIn && isProtectedRoute) return true;
      if (!isProtectedRoute) return true;

      // deny access for all other cases
      return false;
    },
    jwt: ({ token, user }) => {
      if (user) {
        // user is signed in
        // inject userId into token
        token.userId = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      // inject userId into session to make it available to the client
      // must create next-auth-d.ts and update JWT interface to include userId
      if (session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
