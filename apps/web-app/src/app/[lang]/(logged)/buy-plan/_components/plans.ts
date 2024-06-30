import type { Stripe } from "stripe";

import type { ProductWithPrices } from "./PricingPlans";
import type { Dictionary } from "~/utils/getDictionary";

export const getPlans = ({
  products,
  subscription,
  manageLink,
  t,
}: {
  products: ProductWithPrices[];
  subscription?: Stripe.Subscription;
  manageLink: string;
  t: Dictionary;
}) => {
  return products
    .map((product) => {
      const monthlyPrice = product.prices.find(
        (price) => price.recurring?.interval === "month",
      );
      const yearlyPrice = product.prices.find(
        (price) => price.recurring?.interval === "year",
      );
      const isSubscribed = subscription?.items.data.some(
        (item) => item.plan.product === product.id,
      );
      return {
        id: product.id,
        title: product.name,
        description: product.description ?? undefined,
        features: product.marketing_features.map((feature) => feature.name),
        popular: product.metadata.popular === "true",
        monthlyPlan: {
          price: monthlyPrice?.unit_amount ?? 0,
          currency: monthlyPrice?.currency,
          checkoutUrl: isSubscribed ? manageLink : monthlyPrice?.checkoutUrl,
          actionLabel: subscription
            ? isSubscribed
              ? t.billing.manage
              : t.billing.upgrade
            : t.billing.subscribe,
        },
        yearlyPlan: {
          price: yearlyPrice?.unit_amount ?? 0,
          currency: yearlyPrice?.currency,
          checkoutUrl: isSubscribed ? manageLink : yearlyPrice?.checkoutUrl,
          actionLabel: subscription
            ? isSubscribed
              ? t.billing.manage
              : t.billing.upgrade
            : t.billing.subscribe,
        },
      };
    })
    .sort((a, b) => a.monthlyPlan.price - b.monthlyPlan.price);
};
