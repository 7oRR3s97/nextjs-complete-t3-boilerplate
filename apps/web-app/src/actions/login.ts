"use server";

import type { TRPCError } from "@trpc/server";
import type { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

import type { LoginSchema } from "@monorepo/validators/auth";

import { api } from "~/trpc/server";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  try {
    const response = await api.auth.login(data);
    return response;
  } catch (err) {
    const error = err as TRPCError;
    if (isRedirectError(error.cause)) {
      throw error.cause;
    }
    throw error;
  }
};
