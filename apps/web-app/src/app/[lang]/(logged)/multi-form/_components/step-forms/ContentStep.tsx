"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
import { CreatePostContentSchema } from "@monorepo/validators/post";

import type { Dictionary } from "~/utils/getDictionary";
import { usePostMultiFormStore } from "~/stores/usePostMultiFormStore";
import Navigation from "../Navigation";
import { steps } from "../steps";

export default function ContentStep({ t }: { t: Dictionary }) {
  const router = useRouter();
  const { previousStep, setPreviousStep, setContent, content } =
    usePostMultiFormStore();
  const currentStep = steps.findIndex((step) => step.id === "content");
  const form = useForm({
    schema: CreatePostContentSchema,
    defaultValues: content,
  });

  const delta = currentStep - previousStep;

  const { handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    setContent(data);
    setPreviousStep(currentStep);
    router.push("/multi-form/image");
  });

  const onPrev = () => {
    setPreviousStep(currentStep);
    router.push("/multi-form");
  };

  const progress = (currentStep / (steps.length - 1)) * 100;
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
              {t.multiForm.postContentInformation}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {t.multiForm.providePostContentInformation}
            </p>
            <div className="mt-8 grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.multiForm.title}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="title"
                          placeholder={t.multiForm.titlePlaceholder}
                          required
                          maxLength={50}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.multiForm.content}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="content"
                          placeholder={t.multiForm.contentPlaceholder}
                          required
                          maxLength={50}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </motion.div>
        </form>
      </Form>
      <Navigation onNext={onSubmit} t={t} onPrev={onPrev} />
    </>
  );
}
