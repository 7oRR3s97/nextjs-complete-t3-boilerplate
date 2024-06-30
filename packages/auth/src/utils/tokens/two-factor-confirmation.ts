import type { Database } from "@monorepo/db";
import { eq, schema } from "@monorepo/db";

export const getTwoFactorConfirmationByUserId = async ({
  userId,
  db,
}: {
  userId: string;
  db: Database;
}) => {
  try {
    const twoFactorConfirmation =
      await db.query.twoFactorConfirmations.findFirst({
        where: eq(schema.twoFactorConfirmations.userId, userId),
      });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
