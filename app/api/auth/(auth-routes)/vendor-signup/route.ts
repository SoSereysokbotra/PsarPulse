import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/services/auth.service";
import { authLimiter } from "@/lib/auth/middleware/rate-limiter.middleware";
import z from "zod";

const vendorSignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  storeName: z.string().min(2, "Store name is required"),
  phone: z.string().optional(),
  businessAddress: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = await authLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const validatedData = vendorSignupSchema.parse(body);

    const result = await AuthService.requestVendorSignup({
      fullName: validatedData.fullName,
      email: validatedData.email,
      businessName: validatedData.storeName,
      businessEmail: validatedData.email,
      phone: validatedData.phone,
    });

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Vendor signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
