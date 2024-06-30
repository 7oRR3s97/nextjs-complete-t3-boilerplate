import type { Locale } from "~/i18n";
import { NewPasswordForm } from "~/app/[lang]/auth/_components/NewPasswordForm";
import { getDictionary } from "~/utils/getDictionary";

export default async function NewPasswordPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const tokenConfirmation = process.env.RESET_PASSWORD_METHOD === "token";
  const t = await getDictionary(params.lang);

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t.signIn.resetPassword}</h1>
        <p className="text-balance text-muted-foreground">
          {t.signIn.resetPasswordData}
        </p>
      </div>
      <div className="grid gap-4">
        <NewPasswordForm t={t} tokenConfirmation={tokenConfirmation} />
      </div>
    </>
  );
}
