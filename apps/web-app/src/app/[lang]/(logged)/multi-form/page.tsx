import type { Locale } from "~/i18n";
import IntroStep from "~/app/[lang]/(logged)/multi-form/_components/step-forms/IntroStep";
// import { api } from "~/trpc/server";
import { getDictionary } from "~/utils/getDictionary";

export default async function PersonalStylistPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);
  // const subscriptions = await api.billing.getSubscriptions();
  // const actualSubscription = subscriptions.data.find(
  //   (subscription) => subscription.status === "active",
  // );
  const hasSubscription = true;
  return <IntroStep t={t} hasSubscription={hasSubscription} />;
}
