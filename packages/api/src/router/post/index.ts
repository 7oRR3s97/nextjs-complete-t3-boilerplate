import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { desc, eq, schema } from "@monorepo/db";
import { CreatePostSchema } from "@monorepo/validators/post";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from "../../middlewares";
import { uploadImage } from "../../utils/cloudinary";
import { ratelimit } from "../../utils/ratelimit";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: desc(schema.posts.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(schema.posts.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.session.user.id);
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
          cause:
            "User has exceeded the limit of requests to create a personal style review.",
        });
      }
      const authorId = ctx.session.user.id;
      const coverImageUrl = input.image
        ? (
            await uploadImage({
              image: input.image,
              folder: `posts_${process.env.APP_ENV}`,
            })
          ).secure_url
        : undefined;

      return ctx.db
        .insert(schema.posts)
        .values({ ...input, coverImageUrl, authorId });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(schema.posts.id, input),
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      if (
        post.authorId !== ctx.session.user.id &&
        ctx.session.user.role !== "admin"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User not authorized",
          cause: "User is not the author of the post",
        });
      }
      return ctx.db.delete(schema.posts).where(eq(schema.posts.id, input));
    }),
  deleteAll: adminProcedure.input(z.number()).mutation(({ ctx }) => {
    return ctx.db.delete(schema.posts);
  }),
} satisfies TRPCRouterRecord;
