import type { Locale } from "~/i18n";
import { api } from "~/trpc/server";
import { getDictionary } from "~/utils/getDictionary";
import { PricingPlans } from "./_components/PricingPlans";

export default async function BuyPlanPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);
  const products = await api.billing.getProducts({
    successUrl: "/personal-stylist",
    cancelUrl: "/buy-plan",
  });
  const subscriptions = await api.billing.getSubscriptions();
  const actualSubscription = subscriptions.data.find(
    (subscription) => subscription.status === "active",
  );
  const manageLink = await api.billing.getCustomerPortalLink({
    returnUrl: "/",
  });
  return (
    <PricingPlans
      products={products}
      subscription={actualSubscription}
      manageLink={manageLink}
      t={t}
    />
  );
}
