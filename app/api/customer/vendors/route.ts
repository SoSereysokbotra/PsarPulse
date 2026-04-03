import { NextResponse } from "next/server";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";

export async function GET() {
  try {
    const vendors = await VendorRepository.findAllActive();

    // Map database fields to the format expected by the frontend
    const mappedVendors = vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.businessName,
      category: vendor.category || "General",
      rating: vendor.rating ? parseFloat(vendor.rating) : 0,
      deliveryTime: vendor.deliveryTime || "20-40",
      coords: [
        vendor.latitude ? parseFloat(vendor.latitude) : 11.5621,
        vendor.longitude ? parseFloat(vendor.longitude) : 104.888
      ],
      image: vendor.coverImage || vendor.businessLogo || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
    }));

    return NextResponse.json({ success: true, data: mappedVendors });
  } catch (error) {
    console.error("[CUSTOMER_VENDORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
