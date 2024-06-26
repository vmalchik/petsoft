// NextAuth will use this API endpoint (/api/auth/session) to get the user session via "useSession" hook and make it available to the client
// NextAuth will internally make a call to this route handler to get the user session
export { GET, POST } from "@/lib/auth";
