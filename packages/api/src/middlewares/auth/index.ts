import { TRPCError } from "@trpc/server";

import type { Session } from "@monorepo/auth";
import { eq } from "@monorepo/db";
import { users } from "@monorepo/db/schema/auth";

import { t } from "../../trpc";

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authenticated",
      cause:
        "User did not provide any authentication token or token is expired",
    });
  }
  return next({
    // infers the `session` as non-nullable
    ctx: { session: { ...ctx.session, user: ctx.session.user } as Session },
  });
});

export const adminMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authenticated",
      cause:
        "User did not provide any authentication token or token is expired",
    });
  }
  const user = await ctx.db.query.users.findFirst({
    where: eq(users.id, ctx.session.user.id),
  });

  if (user?.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User not authorized",
      cause: "User is not an admin",
    });
  }
  return next({
    ctx,
  });
});
