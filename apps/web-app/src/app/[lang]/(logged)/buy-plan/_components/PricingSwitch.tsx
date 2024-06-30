import { Tabs, TabsList, TabsTrigger } from "@monorepo/ui/tabs";

import type { Dictionary } from "~/utils/getDictionary";

interface PricingSwitchProps {
  onSwitch: (value: string) => void;
  t: Dictionary;
}

export const PricingSwitch = ({ onSwitch, t }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="mx-auto w-40" onValueChange={onSwitch}>
    <TabsList className="px-2 py-6">
      <TabsTrigger value="0" className="text-base">
        {t.billing.monthly}
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        {t.billing.yearly}
      </TabsTrigger>
    </TabsList>
  </Tabs>
);
