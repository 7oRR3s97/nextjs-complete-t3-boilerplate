import Link from "next/link";

import type { Locale } from "~/i18n";
import { BottomNav } from "~/app/[lang]/(logged)/_components/menu/BottomNav";
import { Sidebar } from "~/app/[lang]/(logged)/_components/menu/Sidebar";
import { getDictionary } from "~/utils/getDictionary";

export default async function LoggedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="container h-auto py-16">
      <header className="fixed inset-x-0 top-0 border-b bg-white p-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link className="flex items-center gap-2 text-xl font-bold" href="#">
            <span className="sm:block">shadcn</span>
          </Link>
          <Sidebar t={t} />
        </div>
      </header>
      {children}
      <BottomNav t={t} />
    </main>
  );
}
