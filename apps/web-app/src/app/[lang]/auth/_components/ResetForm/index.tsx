"use client";

import { useRouter } from "next/navigation";
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
import { ResetPasswordSchema } from "@monorepo/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { api } from "~/trpc/react";

export const ResetForm = ({
  t,
  tokenConfirmation,
}: {
  t: Dictionary;
  tokenConfirmation: boolean;
}) => {
  const router = useRouter();
  const { mutate: reset, isPending } = api.auth.resetPassword.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
      }
      if (tokenConfirmation) {
        router.push(`/auth/new-password?email=${data.email}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: ResetPasswordSchema,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    reset(data);
  });

  return (
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {t.signIn.sendResetEmail}
        </Button>
      </form>
    </Form>
  );
};
