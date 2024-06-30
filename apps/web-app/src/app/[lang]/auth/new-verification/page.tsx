import type { Locale } from "~/i18n";
import { NewVerificationForm } from "~/app/[lang]/auth/_components/NewVerificationForm";
import { getDictionary } from "~/utils/getDictionary";

export default async function NewPasswordPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t.signIn.verifyEmail}</h1>
        <p className="text-balance text-muted-foreground">
          {t.signIn.verifyEmailWithCode}
        </p>
      </div>
      <div className="grid gap-4">
        <NewVerificationForm t={t} />
      </div>
    </>
  );
}
