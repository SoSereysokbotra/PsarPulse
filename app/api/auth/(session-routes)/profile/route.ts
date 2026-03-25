import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/lib/db/repositories/example.repository";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  
  console.log("Profile API - Token present:", !!token);

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    console.log("Profile API - Payload ID:", payload?.id);
    
    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userData = await UserRepository.findById(payload.id);
    console.log("Profile API - User found:", userData?.fullName);
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
