"use client";

import { Button } from "@monorepo/ui/button";

import type { Dictionary } from "~/utils/getDictionary";

export default function Navigation({
  t,
  onNext,
  onPrev,
  nextTitle,
}: {
  t: Dictionary;
  onNext?: () => void;
  onPrev?: () => void;
  nextTitle?: string;
}) {
  return (
    <>
      {/* Navigation */}
      <div className="mx-auto mt-4 w-[60%] pt-5">
        <div className="flex justify-between">
          {onPrev && (
            <Button type="button" variant="secondary" onClick={onPrev}>
              {t.common.previous}
            </Button>
          )}
          {onNext && (
            <Button type="button" onClick={onNext}>
              {nextTitle ?? t.common.next}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
