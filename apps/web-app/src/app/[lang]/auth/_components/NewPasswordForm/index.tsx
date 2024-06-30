"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@monorepo/ui/input-otp";
import { PasswordInput } from "@monorepo/ui/password-input";
import { ChangePasswordEmailSchema } from "@monorepo/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { api } from "~/trpc/react";

export const NewPasswordForm = ({
  t,
  tokenConfirmation,
}: {
  t: Dictionary;
  tokenConfirmation: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const email = searchParams.get("email") ?? undefined;

  const { mutate: changePasswordEmail, isPending } =
    api.auth.changePasswordEmail.useMutation({
      onSuccess: (data) => {
        toast.success(data.success);
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: changePasswordEmailToken, isPending: tokenIsPending } =
    api.auth.changePasswordEmailToken.useMutation({
      onSuccess: (data) => {
        toast.success(data.success);
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const NewPasswordFormSchema = ChangePasswordEmailSchema.extend({
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.signIn.errorPassword,
    path: ["confirmPassword"],
  });

  const form = useForm({
    schema: NewPasswordFormSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const onSubmit = handleSubmit((data) => {
    if (tokenConfirmation) {
      changePasswordEmailToken({
        password: data.password,
        token: data.token,
        email,
      });
    } else {
      changePasswordEmail({ password: data.password, token });
    }
  });

  const isFormValid =
    watch("password").length >= 6 &&
    !errors.password &&
    !errors.confirmPassword &&
    watch("password") === watch("confirmPassword");

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
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
                  <PasswordInput {...field} id="password" required />
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
        {tokenConfirmation && (
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.signIn.resetPasswordCode}</FormLabel>
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
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid || isPending || tokenIsPending}
        >
          {t.signIn.changePassword}
        </Button>
      </form>
    </Form>
  );
};
