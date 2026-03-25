import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/lib/db/repositories/example.repository";
import {
  authenticate,
  getAuthUser,
} from "@/lib/auth/middleware/auth.middleware";

export async function GET(request: NextRequest) {
  // Authenticate request
  const authResponse = await authenticate(request);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const userData = await UserRepository.findById(user.id);
    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user data without sensitive information
    const { passwordHash, ...safeUserData } = userData;

    // Fetch vendor data if user is a vendor
    let vendorData = null;
    if (safeUserData.role === "vendor") {
      const { VendorRepository } = await import("@/lib/db/repositories/vendor.repository");
      vendorData = await VendorRepository.findByUserId(userData.id);
    }

    return NextResponse.json({
      success: true,
      data: { 
        user: safeUserData,
        vendor: vendorData 
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
