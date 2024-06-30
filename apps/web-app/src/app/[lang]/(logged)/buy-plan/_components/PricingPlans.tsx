"use client";

import type { Stripe } from "stripe";
import React, { useState } from "react";

import type { Dictionary } from "~/utils/getDictionary";
import { getPlans } from "./plans";
import { PricingCard } from "./PricingCard";
import { PricingHeader } from "./PricingHeader";
import { PricingSwitch } from "./PricingSwitch";

interface Price extends Stripe.Price {
  checkoutUrl?: string;
}

export interface ProductWithPrices extends Stripe.Product {
  prices: Price[];
}

export function PricingPlans({
  products,
  subscription,
  manageLink,
  t,
}: {
  products: ProductWithPrices[];
  subscription?: Stripe.Subscription;
  manageLink: string;
  t: Dictionary;
}) {
  const [isYearly, setIsYearly] = useState(false);
  const togglePricingPeriod = (value: string) =>
    setIsYearly(parseInt(value) === 1);
  const plans = getPlans({ products, subscription, manageLink, t });
  return (
    <div className="mx-auto max-w-xl py-4">
      <PricingHeader
        title={t.billing.pricePlans}
        subtitle={t.billing.choosePlan}
      />
      <PricingSwitch onSwitch={togglePricingPeriod} t={t} />
      <section className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
        {plans.map((plan) => {
          return (
            <PricingCard key={plan.id} plan={plan} isYearly={isYearly} t={t} />
          );
        })}
      </section>
    </div>
  );
}
