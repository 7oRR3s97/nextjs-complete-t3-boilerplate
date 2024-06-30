import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  await resend.emails.send({
    from: "mail@auth-masterclass-tutorial.com",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const tokenConfirmation = process.env.RESET_PASSWORD_METHOD === "token";
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  const resetBody = tokenConfirmation
    ? `<p>The code to reset your password is: ${token}</p>`
    : `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`;

  await resend.emails.send({
    from: "mail@auth-masterclass-tutorial.com",
    to: email,
    subject: "Reset your password",
    html: resetBody,
  });
};

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const tokenConfirmation = process.env.EMAIL_CONFIRMATION_METHOD === "token";
  const confirmLink = `${domain}/auth/new-verification-email?token=${token}`;
  const confirmBody = tokenConfirmation
    ? `<p>The code to confirm your email is: ${token}</p>`
    : `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`;

  await resend.emails.send({
    from: "mail@auth-masterclass-tutorial.com",
    to: email,
    subject: "Confirm your email",
    html: confirmBody,
  });
};
