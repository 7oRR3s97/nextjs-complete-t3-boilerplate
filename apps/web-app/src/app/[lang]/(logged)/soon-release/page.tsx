import type { Locale } from "~/i18n";
import { getDictionary } from "~/utils/getDictionary";

export default async function SoonReleasePage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);
  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {t.homePage.title}
        </h1>
        <p className="text-center text-lg">{t.homePage.releaseSoonMessage}</p>
      </div>
    </div>
  );
}
