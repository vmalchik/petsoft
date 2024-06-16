import NextAuth, { NextAuthConfig } from "next-auth";

const config = {
  pages: {
    signIn: "/login",
  },
  //   Following are the default session values
  //   session: {
  //     maxAge: 30 * 24 * 60 * 60, // 30 days
  //     strategy: "jwt",
  //   },
  providers: [],
  // Callbacks are used to handle response to user actions (e.g. login)
  callbacks: {
    authorized: async ({ request }) => {
      const isProtectedRoute = request.nextUrl.pathname.includes("/app");
      if (isProtectedRoute) {
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { auth } = NextAuth(config);
