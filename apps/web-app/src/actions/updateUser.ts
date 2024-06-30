"use server";

import type { TRPCError } from "@trpc/server";
import type { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

import type { UpdateUserSchema } from "@monorepo/validators/auth";
import { auth } from "@monorepo/auth";

import { api } from "~/trpc/server";

export const updateUser = async (data: z.infer<typeof UpdateUserSchema>) => {
  try {
    const response = await api.auth.updateUser(data);
    return response;
  } catch (err) {
    const error = err as TRPCError;
    if (isRedirectError(error.cause)) {
      const session = await auth();
      if (!session?.user.emailVerified) {
        return { success: "Email updated! Verify your email to continue." };
      }
      return { success: "User updated!" };
    }
    throw error;
  }
};
