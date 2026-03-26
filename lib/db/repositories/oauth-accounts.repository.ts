import { eq, and } from "drizzle-orm";
import { db } from "../index";
import { oauthAccounts } from "../schema";

export class OAuthAccountRepository {
  /**
   * Find an OAuth account by provider and provider account id
   */
  static async findByProvider(provider: string, providerUserId: string) {
    const [account] = await db
      .select()
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.provider, provider),
          eq(oauthAccounts.providerUserId, providerUserId)
        )
      );
    return account;
  }

  /**
   * Create a new OAuth account mapping
   */
  static async create(data: { userId: string; provider: string; providerUserId: string }) {
    const [account] = await db.insert(oauthAccounts).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return account;
  }
}
