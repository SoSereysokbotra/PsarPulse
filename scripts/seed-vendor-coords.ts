import { db } from "../lib/db";
import { vendors } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function seedCoords() {
  const allVendors = await db.query.vendors.findMany();
  
  // Base coords for Phnom Penh
  const baseLat = 11.5564;
  const baseLng = 104.9282;

  for (const v of allVendors) {
    // Generate some random coordinates nearby
    const lat = baseLat + (Math.random() - 0.5) * 0.05;
    const lng = baseLng + (Math.random() - 0.5) * 0.05;

    await db.update(vendors)
      .set({ 
        latitude: lat.toFixed(8), 
        longitude: lng.toFixed(8) 
      })
      .where(eq(vendors.id, v.id));
    
    console.log(`Updated vendor ${v.businessName} with coords (${lat}, ${lng})`);
  }
}

seedCoords().catch(console.error);
