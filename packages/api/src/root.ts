import { authRouter } from "./router/auth";
import { billingRouter } from "./router/billing";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  billing: billingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
