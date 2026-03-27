import { eq, desc } from "drizzle-orm";
import { db } from "../index";
import { vendorInventory } from "../schema/inventory.schema";

export class InventoryRepository {
  static async create(data: typeof vendorInventory.$inferInsert) {
    const [result] = await db.insert(vendorInventory).values(data).returning();
    return result;
  }

  static async findByVendorId(vendorId: string) {
    return await db.query.vendorInventory.findMany({
      where: eq(vendorInventory.vendorId, vendorId),
      orderBy: [desc(vendorInventory.createdAt)],
    });
  }

  static async findById(id: string) {
    return await db.query.vendorInventory.findFirst({
      where: eq(vendorInventory.id, id),
    });
  }

  static async update(id: string, data: Partial<typeof vendorInventory.$inferInsert>) {
    const [result] = await db.update(vendorInventory)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(vendorInventory.id, id))
      .returning();
    return result;
  }

  static async delete(id: string) {
    const [result] = await db.delete(vendorInventory)
      .where(eq(vendorInventory.id, id))
      .returning();
    return result;
  }
}
