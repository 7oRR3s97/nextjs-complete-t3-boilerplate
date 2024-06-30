"use client";

import { useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@monorepo/ui/input-otp";
import { PasswordInput } from "@monorepo/ui/password-input";
import { LoginSchema } from "@monorepo/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { login } from "~/actions/login";

export const LoginForm = ({ t }: { t: Dictionary }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    schema: LoginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      login({ ...data, callbackUrl })
        .then((data) => {
          if (data?.success) {
            form.reset();
            toast.success(data.success);
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch((error: Error) => {
          console.log(error);
          if (!isRedirectError(error)) {
            if (error.message) {
              if (error.message.includes("credentialssignin")) {
                toast.error(t.signIn.invalidCredentials);
              } else {
                toast.error(t.signIn.somethingWentWrong);
              }
            }
          }
        });
    });
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {showTwoFactor && (
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.signIn.twoFactorCode}</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {!showTwoFactor && (
            <>
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
                        <div className="flex items-center">
                          {t.signIn.password}
                          <Link
                            href="/auth/forgot-password"
                            className="ml-auto inline-block text-sm underline"
                          >
                            {t.signIn.forgotPassword}
                          </Link>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput {...field} id="password" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {t.signIn.login}
          </Button>
        </form>
      </Form>
    </>
  );
};
