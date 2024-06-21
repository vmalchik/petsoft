import { User } from "next-auth";

declare module "next-auth" {
  // Inject custom properties into User object
  interface User {
    hasAccess: boolean;
  }

  // Assert user will exist in session
  interface Session {
    user: User;
  }
}

// Inject custom properties into JWT token
declare module "@auth/core/jwt" {
  export interface JWT {
    userId: string;
    hasAccess: boolean;
  }
}
