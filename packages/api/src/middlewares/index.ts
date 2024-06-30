import { t } from "../trpc";
import { adminMiddleware, authMiddleware } from "./auth";

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(authMiddleware);

/**
 * Admin procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users that are admins, use this.
 *
 * @see https://trpc.io/docs/procedures
 */
export const adminProcedure = protectedProcedure.use(adminMiddleware);
