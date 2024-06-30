import { Settings } from "lucide-react";

import { auth } from "@monorepo/auth";

import type { Locale } from "~/i18n";
import { getDictionary } from "~/utils/getDictionary";
import ChangePassword from "./_components/ChangePassword";
import EditUserInfo from "./_components/EditUserInfo";

export default async function SettingsPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);
  const session = await auth();

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="mt-4 flex flex-row">
          <Settings size={32} />
          <h1 className="text-lg font-extrabold tracking-tight">
            {t.settings.profileSettings}
          </h1>
        </div>
        <EditUserInfo t={t} session={session} />
        {session?.user.isOAuth === false && <ChangePassword t={t} />}
      </div>
    </div>
  );
}
