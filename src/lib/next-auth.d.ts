import { User } from "next-auth";

// Inject user id into session
declare module "next-auth" {
  interface Session {
    user: User;
  }
}

// Inject userId into JWT token
declare module "@auth/core/jwt" {
  export interface JWT {
    userId: string;
  }
}
