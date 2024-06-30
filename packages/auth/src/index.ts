import NextAuth, { AuthError } from "next-auth";

import { authConfig } from "./config";

const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

export type { Session } from "next-auth";
export { authConfig };

export { GET, POST, auth, signIn, signOut, AuthError };
