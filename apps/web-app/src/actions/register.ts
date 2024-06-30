"use server";

import type { TRPCError } from "@trpc/server";
import type { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

import type { RegisterSchema } from "@monorepo/validators/auth";

import { api } from "~/trpc/server";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const response = await api.auth.registerUser(data);
    return response;
  } catch (err) {
    const error = err as TRPCError;
    if (isRedirectError(error.cause)) {
      throw error.cause;
    }
    throw error;
  }
};
