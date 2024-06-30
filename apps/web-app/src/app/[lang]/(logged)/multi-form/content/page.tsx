import type { Locale } from "~/i18n";
import ContentStep from "~/app/[lang]/(logged)/multi-form/_components/step-forms/ContentStep";
import { getDictionary } from "~/utils/getDictionary";

export default async function MultiFormPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);
  return <ContentStep t={t} />;
}
