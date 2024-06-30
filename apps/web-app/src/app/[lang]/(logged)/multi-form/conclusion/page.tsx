import type { Locale } from "~/i18n";
import ConclusionStep from "~/app/[lang]/(logged)/multi-form/_components/step-forms/ConclusionStep";
import { getDictionary } from "~/utils/getDictionary";

export default async function PersonalStylistPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);
  return <ConclusionStep t={t} />;
}
