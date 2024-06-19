// NextAuth will use this API endpoint (/api/auth/session) to get the user session via "useSession" hook and make it available to the client
// NextAuth will internally make a call to this route handler to get the user session

// Export the NextAuth handlers to be used in the API route to retrieve user session from the server
// import { GET, POST } from "@/lib/auth";
// export { GET, POST };
export { GET, POST } from "@/lib/auth";
