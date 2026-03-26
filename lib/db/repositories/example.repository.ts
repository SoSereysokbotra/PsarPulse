import { eq, and, desc, lt, isNull } from "drizzle-orm";
import { db } from "../index";
import { users, refreshTokens, verificationCodes, oauthAccounts } from "../schema";
import type {
  NewUser,
  User,
  UserUpdate,
  NewRefreshToken,
  NewVerificationCode,
} from "../types";

/**
 * User Repository
 */
export class UserRepository {
  /**
   * Create a new user
   */
  static async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  /**
   * Find user by OAuth provider and provider user ID
   */
  static async findByOAuthId(provider: string, providerUserId: string): Promise<User | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
        status: users.status,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .innerJoin(
        oauthAccounts,
        eq(users.id, oauthAccounts.userId)
      )
      .where(
        and(
          eq(oauthAccounts.provider, provider),
          eq(oauthAccounts.providerUserId, providerUserId)
        )
      );
    return user as User;
  }

  /**
   * Find users by role
   */
  static async findByRole(
    role: "vendor" | "admin",
  ): Promise<User[]> {
    const userList = await db.select().from(users).where(eq(users.role, role));
    return userList;
  }

  /**
   * Update user
   */
  static async update(id: string, data: UserUpdate): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  /**
   * Get user with their refresh tokens
   */
  static async findWithRefreshTokens(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        refreshTokens: true,
      },
    });
  }

  /**
   * Verify user email
   */
  static async verifyEmail(id: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isVerified: true, status: "active", updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}

/**
 * Refresh Token Repository
 */
export class RefreshTokenRepository {
  /**
   * Create a new refresh token
   */
  static async create(
    data: NewRefreshToken,
  ): Promise<typeof refreshTokens.$inferSelect> {
    const [token] = await db.insert(refreshTokens).values(data).returning();
    return token;
  }

  /**
   * Find token by hash
   */
  static async findByTokenHash(tokenHash: string) {
    const [token] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash));
    return token;
  }

  /**
   * Find tokens by family ID
   */
  static async findByFamilyId(familyId: string) {
    return await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.familyId, familyId));
  }

  /**
   * Find active tokens by user ID
   */
  static async findActiveByUserId(userId: string) {
    return await db
      .select()
      .from(refreshTokens)
      .where(
        and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)),
      )
      .orderBy(desc(refreshTokens.createdAt));
  }

  /**
   * Revoke token by hash
   */
  static async revokeToken(tokenHash: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(refreshTokens.tokenHash, tokenHash));
  }

  /**
   * Revoke token by ID
   */
  static async revoke(id: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(refreshTokens.id, id));
  }

  /**
   * Revoke all user tokens
   */
  static async revokeAllByUserId(userId: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(
        and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)),
      );
  }

  /**
   * Alias for revokeAllByUserId
   */
  static async revokeAllTokensForUser(userId: string): Promise<void> {
    return this.revokeAllByUserId(userId);
  }

  /**
   * Get active sessions for a user
   */
  static async getActiveSessions(userId: string) {
    return await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.userId, userId),
          isNull(refreshTokens.revokedAt),
        ),
      )
      .orderBy(desc(refreshTokens.createdAt));
  }

  /**
   * Delete expired tokens
   */
  static async deleteExpired(): Promise<void> {
    await db
      .delete(refreshTokens)
      .where(lt(refreshTokens.expiresAt, new Date()));
  }
}

/**
 * Verification Code Repository
 */
export class VerificationCodeRepository {
  /**
   * Create a new verification code
   */
  static async create(data: NewVerificationCode) {
    const [code] = await db.insert(verificationCodes).values(data).returning();
    return code;
  }

  /**
   * Find active code for user by purpose
   */
  static async findActiveByUserIdAndPurpose(
    userId: string,
    purpose: "email_verification" | "password_reset",
  ) {
    const [code] = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.userId, userId),
          eq(verificationCodes.purpose, purpose),
        ),
      )
      .orderBy(desc(verificationCodes.createdAt))
      .limit(1);
    return code;
  }

  /**
   * Alias for findActiveByUserIdAndPurpose
   */
  static async findByUserIdAndPurpose(
    userId: string,
    purpose: "email_verification" | "password_reset",
  ) {
    return this.findActiveByUserIdAndPurpose(userId, purpose);
  }

  /**
   * Delete code by ID
   */
  static async delete(id: string): Promise<void> {
    await db.delete(verificationCodes).where(eq(verificationCodes.id, id));
  }

  /**
   * Delete user codes by purpose
   */
  static async deleteByUserIdAndPurpose(
    userId: string,
    purpose: "email_verification" | "password_reset",
  ): Promise<void> {
    await db
      .delete(verificationCodes)
      .where(
        and(
          eq(verificationCodes.userId, userId),
          eq(verificationCodes.purpose, purpose),
        ),
      );
  }

  /**
   * Delete expired codes
   */
  static async deleteExpired(): Promise<void> {
    await db
      .delete(verificationCodes)
      .where(lt(verificationCodes.expiresAt, new Date()));
  }
}
