import { eq, desc } from "drizzle-orm";
import { db } from "../index";
import { vendorExpenses } from "../schema/expenses.schema";

export class ExpensesRepository {
  static async create(data: typeof vendorExpenses.$inferInsert) {
    const [result] = await db.insert(vendorExpenses).values(data).returning();
    return result;
  }

  static async findByVendorId(vendorId: string) {
    return await db.query.vendorExpenses.findMany({
      where: eq(vendorExpenses.vendorId, vendorId),
      orderBy: [desc(vendorExpenses.expenseDate)],
    });
  }

  static async findById(id: string) {
    return await db.query.vendorExpenses.findFirst({
      where: eq(vendorExpenses.id, id),
    });
  }
}
