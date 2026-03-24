import { eq, lt } from "drizzle-orm";
import { db } from "../index";
import { oauthStates } from "../schema";

export class OAuthStateRepository {
  /**
   * Create a new OAuth state entry for PKCE and verification
   */
  static async create(data: { state: string; codeVerifier?: string; provider: string; redirectUri: string; expiresAt: Date }) {
    const [oauthState] = await db.insert(oauthStates).values({
      ...data,
      createdAt: new Date(),
      used: false,
    }).returning();
    return oauthState;
  }

  /**
   * Find OAuth state by the state string
   */
  static async findByState(state: string) {
    const [oauthState] = await db
      .select()
      .from(oauthStates)
      .where(eq(oauthStates.state, state));
    return oauthState;
  }

  /**
   * Mark a state as used (to prevent replay attacks)
   */
  static async markUsed(id: string) {
    const [oauthState] = await db
      .update(oauthStates)
      .set({ used: true })
      .where(eq(oauthStates.id, id))
      .returning();
    return oauthState;
  }

  /**
   * Cleanup expired states
   */
  static async deleteExpired() {
    await db.delete(oauthStates).where(lt(oauthStates.expiresAt, new Date()));
  }
}
