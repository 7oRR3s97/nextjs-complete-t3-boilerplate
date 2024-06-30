import type { User } from "next-auth";
import Stripe from "stripe";

import { db, eq, schema } from "@monorepo/db";

export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
  apiVersion: "2024-04-10",
});

export async function createStripeCustomer(user: User) {
  const customer = await stripe.customers.create({
    email: String(user.email),
  });

  const newUser = await db
    .update(schema.users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(schema.users.id, user.id ?? ""))
    .returning();

  return newUser[0]?.stripeCustomerId;
}
