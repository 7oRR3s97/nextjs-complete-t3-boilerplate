import Image from "next/image";

import { ThemeToggle } from "@monorepo/ui/theme";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">{children}</div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/signIn.webp"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
