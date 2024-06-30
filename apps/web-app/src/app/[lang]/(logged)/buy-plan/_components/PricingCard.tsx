import Link from "next/link";

import { cn } from "@monorepo/ui";
import { Button } from "@monorepo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@monorepo/ui/card";

import type { Dictionary } from "~/utils/getDictionary";
import { formatCurrencyWithoutCents } from "~/utils/currency";
import { CheckItem } from "./CheckItem";

interface PlanProps {
  id: string;
  title: string;
  description?: string;
  features: (string | undefined)[];
  popular: boolean;
  monthlyPlan?: {
    price: number;
    currency?: string;
    checkoutUrl?: string;
    actionLabel: string;
  };
  yearlyPlan?: {
    price: number;
    currency?: string;
    checkoutUrl?: string;
    actionLabel: string;
  };
}

interface PricingCardProps {
  plan: PlanProps;
  isYearly: boolean;
  t: Dictionary;
}

export const PricingCard = ({
  t,
  isYearly,
  plan: { title, description, features, popular, monthlyPlan, yearlyPlan, id },
}: PricingCardProps) => (
  <Card
    className={`flex w-56 flex-col justify-between py-1 ${popular ? "border-rose-400" : "border-zinc-700"} mx-auto sm:mx-0`}
  >
    <div>
      <CardHeader className="pb-8 pt-4">
        {isYearly && yearlyPlan && monthlyPlan ? (
          <div className="flex justify-between">
            <CardTitle className="text-lg text-zinc-700 dark:text-zinc-300">
              {title}
            </CardTitle>
            <div
              className={cn(
                "h-fit rounded-xl bg-zinc-200 px-2.5 py-1 text-sm text-black dark:bg-zinc-800 dark:text-white",
                {
                  "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black":
                    popular,
                },
              )}
            >
              -{" "}
              {formatCurrencyWithoutCents({
                price: monthlyPlan.price * 12 - yearlyPlan.price,
                currency: monthlyPlan.currency,
              })}
            </div>
          </div>
        ) : (
          <CardTitle className="text-lg text-zinc-700 dark:text-zinc-300">
            {title}
          </CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">
            {yearlyPlan && isYearly
              ? formatCurrencyWithoutCents({
                  price: yearlyPlan.price,
                  currency: yearlyPlan.currency,
                })
              : formatCurrencyWithoutCents({
                  price: monthlyPlan?.price,
                  currency: monthlyPlan?.currency,
                })}
          </h3>
          <span className="mb-1 flex flex-col justify-end text-sm">
            {yearlyPlan && isYearly
              ? `/${t.common.year}`
              : monthlyPlan
                ? `/${t.common.month}`
                : null}
          </span>
        </div>
        <CardDescription className="h-28 pt-1.5">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map(
          (feature) =>
            feature && <CheckItem key={`${feature}_${id}`} text={feature} />,
        )}
      </CardContent>
    </div>
    <CardFooter className="center mt-2 justify-center">
      <Link
        href={
          isYearly
            ? String(yearlyPlan?.checkoutUrl)
            : String(monthlyPlan?.checkoutUrl)
        }
      >
        <Button className="relative inline-flex w-full items-center justify-center rounded-md bg-black px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-white dark:text-black">
          <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
          {isYearly ? yearlyPlan?.actionLabel : monthlyPlan?.actionLabel}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);
