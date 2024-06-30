import type { TRPCRouterRecord } from "@trpc/server";
import { redirect } from "next/navigation";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import { signIn, signOut } from "@monorepo/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@monorepo/auth/routes";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
  getPasswordResetTokenByEmail,
  getPasswordResetTokenByToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
  getUserByEmail,
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "@monorepo/auth/utils";
import { eq, schema } from "@monorepo/db";
import {
  ChangePasswordEmailSchema,
  ChangePasswordEmailTokenSchema,
  ChangePasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  UpdateUserSchema,
  VerifyEmailSchema,
  VerifyEmailTokenSchema,
} from "@monorepo/validators/auth";

import { protectedProcedure, publicProcedure } from "../../middlewares";
import posthog from "../../utils/posthog";
import { createStripeCustomer } from "../../utils/stripe";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  resetPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;

      if (!email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No email data",
        });
      }
      const { db } = ctx;

      const existingUser = await getUserByEmail({ email, db });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email not found",
        });
      }

      const passwordResetToken = await generatePasswordResetToken({
        email,
        db,
      });

      if (!passwordResetToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error generating password reset token",
        });
      }

      await sendPasswordResetEmail({
        email: passwordResetToken.email,
        token: passwordResetToken.token,
      });

      return { success: "Reset email sent!", email };
    }),
  verifyEmail: publicProcedure
    .input(VerifyEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const { token } = input;
      const { db } = ctx;

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing token!",
        });
      }
      const existingToken = await getVerificationTokenByToken({ token, db });

      if (!existingToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Token does not exist!",
        });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Token has expired!",
        });
      }

      const existingUser = await getUserByEmail({
        email: existingToken.email,
        db,
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email does not exist!",
        });
      }

      await db
        .update(schema.users)
        .set({
          emailVerified: new Date(),
          email: existingToken.email,
        })
        .where(eq(schema.users.id, existingUser.id));

      await db
        .delete(schema.verificationTokens)
        .where(eq(schema.verificationTokens.id, existingToken.id));

      return { success: "Email verified!" };
    }),
  verifyEmailToken: publicProcedure
    .input(VerifyEmailTokenSchema)
    .mutation(async ({ ctx, input }) => {
      const { token, email } = input;
      const { db } = ctx;

      if (!token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing token!",
        });
      }

      if (!email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing email!",
        });
      }

      const existingUser = await getUserByEmail({ email, db });

      if (!existingUser?.email || !existingUser.password) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid email!",
        });
      }

      const existingToken = await getVerificationTokenByEmail({
        email: existingUser.email,
        db,
      });

      if (!existingToken) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid email!",
        });
      }

      if (existingToken.token !== token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid code!",
        });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Code has expired!",
        });
      }

      await db
        .update(schema.users)
        .set({
          emailVerified: new Date(),
          email: existingToken.email,
        })
        .where(eq(schema.users.id, existingUser.id));

      await db
        .delete(schema.verificationTokens)
        .where(eq(schema.verificationTokens.id, existingToken.id));

      return { success: "Email verified!" };
    }),
  changePasswordEmail: publicProcedure
    .input(ChangePasswordEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { token, password } = input;
      if (!token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No token data",
        });
      }

      if (!password) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No password data",
        });
      }

      const existingToken = await getPasswordResetTokenByToken({ token, db });

      if (!existingToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid token!",
        });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Token has expired!",
        });
      }

      const existingUser = await getUserByEmail({
        email: existingToken.email,
        db,
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email does not exist!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db
        .update(schema.users)
        .set({ password: hashedPassword })
        .where(eq(schema.users.id, existingUser.id));

      await db
        .delete(schema.passwordResetTokens)
        .where(eq(schema.passwordResetTokens.id, existingToken.id));

      return { success: "Password updated!" };
    }),
  changePasswordEmailToken: publicProcedure
    .input(ChangePasswordEmailTokenSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { token, password, email } = input;

      if (!token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No token data",
        });
      }

      if (!password) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No password data",
        });
      }

      if (!email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No email data",
        });
      }

      const existingToken = await getPasswordResetTokenByEmail({ email, db });

      if (!existingToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid token!",
        });
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Token has expired!",
        });
      }

      const existingUser = await getUserByEmail({
        email: existingToken.email,
        db,
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email does not exist!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db
        .update(schema.users)
        .set({ password: hashedPassword })
        .where(eq(schema.users.id, existingUser.id));

      await db
        .delete(schema.passwordResetTokens)
        .where(eq(schema.passwordResetTokens.id, existingToken.id));

      return { success: "Password updated!" };
    }),
  login: publicProcedure.input(LoginSchema).mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    const { email, password, code, callbackUrl } = input;
    const mandatoryEmailConfirmation =
      process.env.MANDATORY_EMAIL_CONFIRMATION === "true";
    const tokenConfirmation = process.env.EMAIL_CONFIRMATION_METHOD === "token";

    if (!email) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Email is required",
      });
    }

    if (!password) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Password is required",
      });
    }

    const existingUser = await getUserByEmail({ email, db });

    if (!existingUser?.email || !existingUser.password) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid credentials!",
      });
    }

    if (!existingUser.emailVerified && mandatoryEmailConfirmation) {
      const verificationToken = await generateVerificationToken({
        email: existingUser.email,
        db,
      });

      if (!verificationToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error generating verification token",
        });
      }

      await sendVerificationEmail({
        email: verificationToken.email,
        token: verificationToken.token,
      });

      if (tokenConfirmation) {
        redirect(`/auth/new-verification?email=${email}`);
      }
      return {
        success: "Confirmation email sent!",
        email: verificationToken.email,
      };
    }
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail({
          email: existingUser.email,
          db,
        });

        if (!twoFactorToken) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid code!",
          });
        }

        if (twoFactorToken.token !== code) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid code!",
          });
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Code has expired!",
          });
        }

        await db
          .delete(schema.twoFactorTokens)
          .where(eq(schema.twoFactorTokens.id, twoFactorToken.id));

        const existingConfirmation = await getTwoFactorConfirmationByUserId({
          userId: existingUser.id,
          db,
        });

        if (existingConfirmation) {
          await db
            .delete(schema.twoFactorConfirmations)
            .where(
              eq(schema.twoFactorConfirmations.id, existingConfirmation.id),
            );
        }

        await db.insert(schema.twoFactorConfirmations).values({
          userId: existingUser.id,
        });
      } else {
        const twoFactorToken = await generateTwoFactorToken({
          email: existingUser.email,
          db,
        });
        if (!twoFactorToken) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error generating two factor token",
          });
        }
        await sendTwoFactorTokenEmail({
          email: twoFactorToken.email,
          token: twoFactorToken.token,
        });

        return { twoFactor: true };
      }
    }
    return signIn("credentials", {
      email: email,
      password: password,
      redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    }) as never as undefined;
  }),
  registerUser: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const mandatoryEmailConfirmation =
        process.env.MANDATORY_EMAIL_CONFIRMATION === "true";
      const tokenConfirmation =
        process.env.EMAIL_CONFIRMATION_METHOD === "token";
      const { db } = ctx;
      const { email, password, name } = input;

      if (!email || !password || !name) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing required fields!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await getUserByEmail({ email, db });

      if (existingUser) {
        return { error: "Email already in use!" };
      }

      const users = await db
        .insert(schema.users)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();
      const user = users[0];
      if (user) {
        posthog.capture({
          event: "user_created",
          distinctId: user.id,
        });
        await createStripeCustomer(user);
      }

      if (mandatoryEmailConfirmation) {
        const verificationToken = await generateVerificationToken({
          email,
          db,
        });

        if (!verificationToken) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error generating verification token",
          });
        }
        await sendVerificationEmail({
          email: verificationToken.email,
          token: verificationToken.token,
        });

        if (tokenConfirmation) {
          redirect(`/auth/new-verification?email=${email}`);
        }

        return {
          success: "Confirmation email sent!",
          email: verificationToken.email,
        };
      }
      return signIn("credentials", {
        email: email,
        password: password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      }) as never as undefined;
    }),
  updateUser: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const mandatoryEmailConfirmation =
        process.env.MANDATORY_EMAIL_CONFIRMATION;
      const { db, session } = ctx;
      const { name, email, isTwoFactorEnabled } = input;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, session.user.id),
      });
      const isOAuth = session.user.isOAuth;
      const newInput = {
        name: name,
        email: isOAuth ? undefined : email,
        isTwoFactorEnabled: isOAuth ? undefined : isTwoFactorEnabled,
      };
      if (newInput.email && newInput.email != session.user.email) {
        const existingUser = await getUserByEmail({
          email: newInput.email,
          db,
        });
        if (existingUser && existingUser.id !== session.user.id) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Email already in use!",
          });
        }
        const verificationToken = await generateVerificationToken({
          email: newInput.email,
          db,
        });
        if (!verificationToken) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error generating verification token",
          });
        }
        await sendVerificationEmail({
          email: verificationToken.email,
          token: verificationToken.token,
        });
        await db.update(schema.users).set({
          emailVerified: null,
        });
      }

      await db
        .update(schema.users)
        .set({
          name: newInput.name,
          email: newInput.email,
          isTwoFactorEnabled: newInput.isTwoFactorEnabled,
          emailVerified: isOAuth ? undefined : null,
        })
        .where(eq(schema.users.id, session.user.id));

      if (newInput.isTwoFactorEnabled) {
        return signOut({
          redirect: true,
          redirectTo: "/en/auth/login",
        }) as never as undefined;
      }
      if (newInput.email && newInput.email != session.user.email) {
        if (mandatoryEmailConfirmation) {
          return signOut({
            redirect: true,
            redirectTo: "/en/auth/login",
          }) as never as undefined;
        }
        return signIn("credentials", {
          email: newInput.email,
          password: user?.password,
        }) as never as undefined;
      }
      return signIn("credentials", {
        email: session.user.email,
        password: user?.password,
      }) as never as undefined;
    }),
  changePassword: protectedProcedure
    .input(ChangePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { currentPassword, newPassword } = input;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, session.user.id),
      });

      if (currentPassword && newPassword && user?.password) {
        const passwordMatch = await bcrypt.compare(
          currentPassword,
          user.password,
        );
        if (!passwordMatch) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid password!",
          });
        }
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db
        .update(schema.users)
        .set({ password: hashedPassword })
        .where(eq(schema.users.id, session.user.id));

      return { success: "Password updated!" };
    }),
} satisfies TRPCRouterRecord;
