"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormInputIcon, HomeIcon, UserRoundCog } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@monorepo/ui/tooltip";

import type { Dictionary } from "~/utils/getDictionary";

const tabs = ["home", "multi-form", "settings"] as const;

export type Tab = (typeof tabs)[number];

export function BottomNav({ t }: { t: Dictionary }) {
  const pathname = usePathname();
  const activeTab = tabs.find((tab) => pathname.includes(tab)) ?? "home";
  const getTab = ({ tab, activeTab }: { activeTab: Tab; tab: Tab }) => {
    const isActive = activeTab === tab;
    const className = `h-6 w-6 ${isActive ? "text-gray-50" : ""}`;
    switch (tab) {
      case "home":
        return {
          icon: <HomeIcon className={className} />,
          tooltipText: t.bottomNav.home,
          href: "/",
        };
      case "multi-form":
        return {
          icon: <FormInputIcon className={className} />,
          tooltipText: t.bottomNav.multiForm,
          href: "/multi-form",
        };
      case "settings":
        return {
          icon: <UserRoundCog className={className} />,
          tooltipText: t.bottomNav.settings,
          href: "/settings",
        };
    }
  };

  const makeTab = ({ tab, activeTab }: { tab: Tab; activeTab: Tab }) => {
    const { icon, tooltipText, href } = getTab({ tab, activeTab });
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className="flex flex-col items-center justify-center text-center"
              href={href}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  tab === activeTab ? "bg-gray-900" : "bg-transparent"
                }`}
              >
                {icon}
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 bg-white">
      <div className="mx-auto flex max-w-xl items-center justify-between">
        <div className="container grid grid-cols-3 items-center justify-evenly py-2">
          {tabs.map((tab) => (
            <div key={tab}>{makeTab({ tab, activeTab })}</div>
          ))}
        </div>
      </div>
    </nav>
  );
}
