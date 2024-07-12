import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { AuthSchema } from "./validations";
import { Routes } from "./constants";

const config = {
  pages: {
    signIn: Routes.Login,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          // Must validate input
          const parsedFormData = AuthSchema.safeParse(credentials);

          if (!parsedFormData.success) {
            return null;
          }
          const { email, password } = parsedFormData.data;
          const user = await getUserByEmail(email);
          if (!user) {
            console.log("User not found");
            return null;
          }

          const matched = await bcrypt.compare(password, user.hashedPassword);
          if (!matched) {
            console.log("Invalid credentials");
            return null;
          }

          return user; // Note: NextAuth will filter out certain user properties such as password
        } catch (e) {
          console.log("Authorize Exception", e);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      // Provided by next-auth. Value is equal to return of authorize function
      const isLoggedIn = Boolean(auth?.user?.email);
      // Custom property added to user object with valid payment plan
      const hasAccess = Boolean(auth?.user?.hasAccess);

      // Requested Route
      const isProtectedAppRoute = request.nextUrl.pathname.includes(Routes.App);
      const isLoginRoute = request.nextUrl.pathname.includes(Routes.Login);
      const isSignupRoute = request.nextUrl.pathname.includes(Routes.Signup);

      if (isLoggedIn && !isProtectedAppRoute) {
        if ((isLoginRoute || isSignupRoute) && !hasAccess) {
          // Redirect to payment page when user is logged without access privileges and navigating to login or signup
          return Response.redirect(new URL(Routes.Payment, request.nextUrl));
        } else if ((isLoginRoute || isSignupRoute) && hasAccess) {
          // Redirect to dashboard page when user is logged with access privileges and navigating to login or signup
          return Response.redirect(new URL(Routes.Dashboard, request.nextUrl));
        }
        // Allow user to visit other unprotected routes when logged in
        return true;
      }

      // Redirect to payment page when user is logged in but has no access privileges
      if (isLoggedIn && isProtectedAppRoute && !hasAccess) {
        return Response.redirect(new URL(Routes.Payment, request.nextUrl));
      }

      // Allow access to protected routes when user is logged with access privileges and navigating to a protected route
      if (isLoggedIn && isProtectedAppRoute && hasAccess) return true;

      // Allow access to unprotected routes when user is not logged in
      if (!isLoggedIn && !isProtectedAppRoute) return true;

      // Deny access for all other cases. By default next-auth will redirect to page specified by signIn property
      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        // Inject custom properties into token
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === "update") {
        // Obtain latest user data from database
        const dbUser = await getUserByEmail(token.email);
        if (dbUser) {
          token.hasAccess = dbUser.hasAccess;
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      // Inject custom properties into session to make it available to the client
      // Note: must create next-auth-d.ts and update JWT interface to include userId
      if (session.user) {
        session.user.id = token.userId;
        session.user.hasAccess = token.hasAccess;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
