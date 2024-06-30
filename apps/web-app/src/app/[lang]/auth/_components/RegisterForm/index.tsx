"use client";

import { useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect";
import { toast } from "sonner";
import { z } from "zod";

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
import { PasswordInput } from "@monorepo/ui/password-input";
import { RegisterSchema } from "@monorepo/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { register } from "~/actions/register";

export const RegisterForm = ({ t }: { t: Dictionary }) => {
  const [isPending, startTransition] = useTransition();

  const RegisterFormSchema = RegisterSchema.extend({
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.signIn.errorPassword,
    path: ["confirmPassword"],
  });

  const form = useForm({
    schema: RegisterFormSchema,
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      register(data)
        .then((data) => {
          if (data?.success) {
            form.reset();
            toast.success(data.success);
          }
        })
        .catch((error: Error) => {
          if (!isRedirectError(error)) {
            if (error.message) {
              toast.error(error.message);
            }
          }
        });
    });
  });

  const isFormValid =
    watch("password").length >= 6 &&
    !errors.password &&
    !errors.confirmPassword &&
    watch("password") === watch("confirmPassword");

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.signIn.email}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      inputMode="email"
                      placeholder={t.signIn.emailPlaceholder}
                      required
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center">{t.signIn.password}</div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="password" type="password" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center">
                      {t.signIn.confirmPassword}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} id="confirmPassword" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center">{t.signIn.name}</div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id="name" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isPending}
          >
            {t.signIn.register}
          </Button>
        </form>
      </Form>
    </>
  );
};
