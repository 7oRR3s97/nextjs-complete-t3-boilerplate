"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@monorepo/ui/input-otp";
import { VerifyEmailSchema } from "@monorepo/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { api } from "~/trpc/react";

export const NewVerificationForm = ({ t }: { t: Dictionary }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    mutate: verifyEmail,
    data,
    error,
  } = api.auth.verifyEmail.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: verifyEmailToken, isPending: isPendingToken } =
    api.auth.verifyEmailToken.useMutation({
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.success);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const token = searchParams.get("token") ?? undefined;
  const email = searchParams.get("email") ?? undefined;

  const form = useForm({
    schema: VerifyEmailSchema,
    defaultValues: {
      token: "",
    },
  });

  const onSubmitToken = form.handleSubmit((data) => {
    verifyEmailToken({ ...data, email });
    router.push("/");
  });

  const onSubmit = useCallback(() => {
    verifyEmail({ token });
  }, [token, verifyEmail]);

  useEffect(() => {
    if (token) {
      onSubmit();
      router.push("/");
    }
  }, [onSubmit, router, token]);
  return (
    <>
      {token && !data?.success && !error && <BeatLoader />}
      {
        <Form {...form}>
          <form onSubmit={onSubmitToken} className="space-y-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.signIn.verifyEmailCode}</FormLabel>
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
            <Button type="submit" className="w-full" disabled={isPendingToken}>
              {t.signIn.verifyEmail}
            </Button>
          </form>
        </Form>
      }
    </>
  );
};
