import {} from "next-auth";

declare module "@auth/core/jwt" {
  export interface JWT {
    userId: string;
  }
}
