import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MANDATORY_EMAIL_CONFIRMATION: z.string(),
    EMAIL_CONFIRMATION_METHOD: z.enum(["token", "link"]),
    RESET_PASSWORD_METHOD: z.enum(["token", "link"]),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    AUTH_TRUST_HOST: z.string().min(1).optional(),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
