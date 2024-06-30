"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import type { Session } from "@monorepo/auth";
import { Button } from "@monorepo/ui/button";
import { Card, CardContent, CardHeader } from "@monorepo/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@monorepo/ui/form";
import { Input } from "@monorepo/ui/input";
import { Switch } from "@monorepo/ui/switch";
import { UpdateUserSchema } from "@monorepo/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { updateUser } from "~/actions/updateUser";

export default function EditUserInfo({
  t,
  session,
}: {
  t: Dictionary;
  session: Session | null;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    schema: UpdateUserSchema,
    defaultValues: {
      name: String(session?.user.name),
      email: String(session?.user.email),
      isTwoFactorEnabled: session?.user.isTwoFactorEnabled,
    },
  });
  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      updateUser(data)
        .then((response) => {
          if (response?.success) {
            toast.success(response.success);
          }
        })
        .catch((error: Error) => {
          if (error.message) {
            toast.error(error.message);
          }
        });
    });
  });
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900">
          {t.settings.editProfile}
        </h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="mt-8 grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.settings.name}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="name"
                          placeholder={t.settings.namePlaceholder}
                          required
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {session?.user.isOAuth === false && (
                <>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.settings.email}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="email"
                              type="email"
                              inputMode="email"
                              placeholder={t.settings.emailPlaceholder}
                              required
                              disabled={isPending}
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
                      name="isTwoFactorEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.settings.TwoFactorEnabled}</FormLabel>
                          <FormDescription>
                            {t.settings.twoFactorDescription}
                          </FormDescription>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <Button type="submit">{t.settings.updateInfo}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
