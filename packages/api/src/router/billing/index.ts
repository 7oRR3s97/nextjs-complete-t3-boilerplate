import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { eq, schema } from "@monorepo/db";
import {
  CreateCheckoutLinkSchema,
  GetCustomerPortalLinkSchema,
  GetProductsSchema,
} from "@monorepo/validators/billing";

import { protectedProcedure } from "../../middlewares";
import { stripe } from "../../utils/stripe";

export const billingRouter = {
  getProducts: protectedProcedure
    .input(GetProductsSchema)
    .query(async ({ ctx, input }) => {
      const { successUrl, cancelUrl } = input;
      const user = await ctx.db.query.users.findFirst({
        where: eq(schema.users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }
      const products = await stripe.products.list();
      const productsWithPrices = await Promise.all(
        products.data.map(async (product) => {
          const pricesList = await stripe.prices.list({
            product: product.id,
          });
          const activePrices = pricesList.data.filter((price) => price.active);
          const prices = await Promise.all(
            activePrices.map(async (price) => {
              const checkout = await stripe.checkout.sessions.create({
                success_url: process.env.VERCEL_URL + successUrl,
                cancel_url: process.env.VERCEL_URL + cancelUrl,
                customer: user.stripeCustomerId ?? "",
                line_items: [
                  {
                    price: price.id,
                    quantity: 1,
                  },
                ],
                mode: "subscription",
              });
              return { ...price, checkoutUrl: checkout.url ?? "" };
            }),
          );
          return { ...product, prices };
        }),
      );

      return productsWithPrices;
    }),
  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(schema.users.id, ctx.session.user.id),
    });

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: String(user.stripeCustomerId),
    });

    return subscriptions;
  }),
  getCustomerPortalLink: protectedProcedure
    .input(GetCustomerPortalLinkSchema)
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(schema.users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId ?? "",
        return_url: process.env.VERCEL_URL + input.returnUrl,
      });

      return portalSession.url;
    }),
  createCheckoutLink: protectedProcedure
    .input(CreateCheckoutLinkSchema)
    .query(async ({ input, ctx }) => {
      const { successUrl, cancelUrl, priceId } = input;
      const user = await ctx.db.query.users.findFirst({
        where: eq(schema.users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const checkout = await stripe.checkout.sessions.create({
        success_url: process.env.VERCEL_URL + successUrl,
        cancel_url: process.env.VERCEL_URL + cancelUrl,
        customer: user.stripeCustomerId ?? "",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
      });

      return checkout.url;
    }),
} satisfies TRPCRouterRecord;
