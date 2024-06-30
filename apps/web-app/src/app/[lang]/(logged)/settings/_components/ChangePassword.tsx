"use client";

import { toast } from "sonner";

import { Button } from "@monorepo/ui/button";
import { Card, CardContent, CardHeader } from "@monorepo/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@monorepo/ui/form";
import { PasswordInput } from "@monorepo/ui/password-input";
import { ChangePasswordSchema } from "@monorepo/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { api } from "~/trpc/react";

export default function ChangePassword({ t }: { t: Dictionary }) {
  const { mutate } = api.auth.changePassword.useMutation({
    onSuccess: (data) => {
      toast.success(data.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const form = useForm({
    schema: ChangePasswordSchema,
    defaultValues: {
      currentPassword: undefined,
      newPassword: undefined,
    },
  });
  const onSubmit = form.handleSubmit((data) => {
    mutate(data);
  });
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900">
          {t.settings.changePassword}
        </h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="mt-8 grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.settings.currentPassword}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          id="currentPassword"
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
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.settings.newPassword}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} id="newPassword" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">{t.settings.changePassword}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
