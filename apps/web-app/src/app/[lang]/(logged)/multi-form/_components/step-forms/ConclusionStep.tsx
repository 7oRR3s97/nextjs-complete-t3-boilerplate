"use client";

import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@monorepo/ui/button";
import { Progress } from "@monorepo/ui/progress";

import type { Dictionary } from "~/utils/getDictionary";
import { usePostMultiFormStore } from "~/stores/usePostMultiFormStore";
import { api } from "~/trpc/react";
import { convertToBase64 } from "~/utils/convertBase64";
import { steps } from "../steps";

export default function ConclusionStep({ t }: { t: Dictionary }) {
  const { mutate, isPending, isSuccess, data } = api.post.create.useMutation({
    onSuccess: () => {
      toast.success("created");
      redirect("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { previousStep, content, image } = usePostMultiFormStore();
  const currentStep = steps.findIndex((step) => step.id === "conclusion");
  const delta = currentStep - previousStep;
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <>
      <Progress value={progress} className="mt-8 h-3 w-[60%]" />
      <motion.div
        initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {!isSuccess && (
          <Button
            onClick={async () => {
              if (!content.title || !content.content || !image.image) {
                return;
              }
              const imageFile = image.image.item(0);
              if (!imageFile) {
                return;
              }
              const imageConverted = await convertToBase64(imageFile);
              mutate({
                title: content.title,
                content: content.content,
                image: imageConverted,
              });
            }}
          >
            {t.common.complete}
          </Button>
        )}
        {isPending && <p>loading...</p>}
        {data && <p>{JSON.stringify(data)}</p>}
      </motion.div>
    </>
  );
}
