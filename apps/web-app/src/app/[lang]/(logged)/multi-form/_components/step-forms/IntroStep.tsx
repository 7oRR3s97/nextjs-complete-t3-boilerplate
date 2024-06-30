"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@monorepo/ui/button";
import { Progress } from "@monorepo/ui/progress";

import type { Dictionary } from "~/utils/getDictionary";
import { usePostMultiFormStore } from "~/stores/usePostMultiFormStore";
import Navigation from "../Navigation";
import { steps } from "../steps";

export default function IntroStep({
  t,
  hasSubscription,
}: {
  t: Dictionary;
  hasSubscription: boolean;
}) {
  const router = useRouter();
  const { previousStep, setPreviousStep } = usePostMultiFormStore();
  const currentStep = steps.findIndex((step) => step.id === "intro");
  const delta = currentStep - previousStep;
  const progress = (currentStep / (steps.length - 1)) * 100;

  const onNext = () => {
    setPreviousStep(currentStep);
    router.push("/multi-form/content");
  };
  if (!hasSubscription) {
    return (
      <>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          {t.multiForm.nonSubscribed}
        </h2>
        <div className="mx-auto mt-4 w-[60%] pt-5">
          <div className="flex justify-between">
            <Link href="/buy-plan">
              <Button type="button">{t.multiForm.subscribeNow}</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Progress value={progress} className="mt-8 h-3 w-[60%]" />
      <motion.div
        initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          {t.multiForm.intro}
        </h2>
      </motion.div>
      <Navigation t={t} onNext={onNext} />
    </>
  );
}
