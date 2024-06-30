"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrashIcon } from "lucide-react";

import { Button } from "@monorepo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@monorepo/ui/form";
import { Input } from "@monorepo/ui/input";
import { Progress } from "@monorepo/ui/progress";

import type { Dictionary } from "~/utils/getDictionary";
import {
  ImageInputSchema,
  usePostMultiFormStore,
} from "~/stores/usePostMultiFormStore";
import Navigation from "../Navigation";
import { steps } from "../steps";

export default function ImageStep({ t }: { t: Dictionary }) {
  const router = useRouter();
  const { previousStep, setPreviousStep, setImage, image } =
    usePostMultiFormStore();
  const form = useForm({
    schema: ImageInputSchema,
    defaultValues: image,
  });
  const currentStep = steps.findIndex((step) => step.id === "image");
  const delta = currentStep - previousStep;

  const { handleSubmit, register, watch, setValue } = form;

  const onSubmit = handleSubmit((data) => {
    setImage(data);
    setPreviousStep(currentStep);
    router.push("/multi-form/conclusion");
  });

  const onPrev = () => {
    setPreviousStep(currentStep);
    router.push("/multi-form-content");
  };

  const progress = (currentStep / (steps.length - 1)) * 100;
  const currentImage = watch("image")?.item(0);

  return (
    <>
      <Progress value={progress} className="mt-8 h-3 w-[60%]" />
      <Form {...form}>
        <form className="space-y-6" onSubmit={onSubmit}>
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold text-gray-900">
              {t.multiForm.image}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {t.multiForm.uploadImage}
            </p>
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>{t.multiForm.image}</FormLabel>
                  <FormControl>
                    <Input
                      {...register("image")}
                      id="image"
                      type="file"
                      accept="image/*"
                      placeholder="image.png"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {currentImage && (
              <div className="mt-4 flex justify-center gap-4">
                <div
                  key={currentImage.name}
                  className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
                >
                  <div className="absolute right-2 top-2 z-10">
                    <Button
                      type="button"
                      onClick={() => {
                        setValue("image", undefined);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Image
                    fill
                    className="object-cover"
                    alt="Image"
                    src={URL.createObjectURL(currentImage)}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </form>
      </Form>
      <Navigation onNext={onSubmit} t={t} onPrev={onPrev} />
    </>
  );
}
