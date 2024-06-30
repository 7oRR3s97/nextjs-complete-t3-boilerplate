import type { Locale } from "~/i18n";
import ImageStep from "~/app/[lang]/(logged)/multi-form/_components/step-forms/ImageStep";
import { getDictionary } from "~/utils/getDictionary";

export default async function FaceImagePage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);
  return <ImageStep t={t} />;
}
