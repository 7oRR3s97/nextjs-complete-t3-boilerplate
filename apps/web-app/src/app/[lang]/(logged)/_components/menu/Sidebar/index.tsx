import Link from "next/link";
import { CreditCard, UserRoundCog } from "lucide-react";

import { auth, signOut } from "@monorepo/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@monorepo/ui/avatar";
import { Button } from "@monorepo/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@monorepo/ui/sheet";
import { ThemeToggle } from "@monorepo/ui/theme";

import type { Dictionary } from "~/utils/getDictionary";
import { api } from "~/trpc/server";
import { getFirstLastName, getInitials } from "~/utils/name";

export async function Sidebar({ t }: { t: Dictionary }) {
  const session = await auth();
  const subscriptions = await api.billing.getSubscriptions();
  const actualSubscription = subscriptions.data.find(
    (subscription) => subscription.status === "active",
  );
  const subscriptionName = actualSubscription?.items.data[0]?.plan.nickname;
  const manageLink = await api.billing.getCustomerPortalLink({
    returnUrl: "/",
  });
  const user = session?.user;
  const avatarInitials = getInitials(user?.name ?? undefined);
  const menuName = getFirstLastName(user?.name ?? undefined);

  return (
    <div className="flex items-center gap-4">
      <Sheet>
        <SheetTrigger>
          <Avatar className="h-6 w-6 border">
            <AvatarImage alt="@shadcn" src={user?.image ?? undefined} />
            <AvatarFallback>{avatarInitials}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="flex h-full flex-col">
            <SheetHeader>
              <div className="flex gap-2">
                <Avatar className="h-6 w-6 border">
                  <AvatarImage alt="@shadcn" src={user?.image ?? undefined} />
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                </Avatar>
                <SheetTitle>{menuName}</SheetTitle>
              </div>
              <div className="flex gap-2 text-muted-foreground">
                {subscriptionName}
              </div>
            </SheetHeader>
            <div className="grid gap-6 py-4 text-lg font-medium">
              <Link
                href="/settings"
                className="text-muted-foreground hover:text-foreground"
              >
                <div className="flex gap-2">
                  <UserRoundCog />
                  {t.sidebar.profile}
                </div>
              </Link>
              <Link
                href={manageLink}
                className="text-muted-foreground hover:text-foreground"
              >
                <div className="flex gap-2">
                  <CreditCard />
                  {t.sidebar.billing}
                </div>
              </Link>
            </div>
            <div className="mt-auto grid gap-1 p-2">
              <SheetFooter>
                <form className="w-full">
                  <Button
                    formAction={async () => {
                      "use server";
                      await signOut({
                        redirect: true,
                        redirectTo: "/en/auth/login",
                      });
                    }}
                    className="w-full"
                  >
                    {t.sidebar.logout}
                  </Button>
                </form>
                <div>
                  <ThemeToggle />
                </div>
              </SheetFooter>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
