import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { NodemailerProvider } from "@/lib/email/providers/nodemailer.provider";
import { getVendorWarningEmailTemplate } from "@/lib/email/templates/vendor-warning.template";

// Admin auth helper
async function isAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin" || payload.role === "super_admin";
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: vendorId } = await params;

  try {
    const body = await request.json();
    const { subject, message } = body as { subject: string; message: string };

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Subject and message are required." },
        { status: 400 }
      );
    }

    // Fetch the vendor to get business name and email
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, vendorId),
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "Vendor not found." },
        { status: 404 }
      );
    }

    const html = getVendorWarningEmailTemplate(
      vendor.businessName,
      message,
      subject
    );

    const emailProvider = new NodemailerProvider();
    await emailProvider.sendEmail(
      vendor.businessEmail,
      `[Warning] ${subject}`,
      html
    );

    return NextResponse.json({
      success: true,
      message: `Warning email sent to ${vendor.businessEmail}`,
    });
  } catch (error) {
    console.error("[ADMIN_VENDOR_WARN_POST]", error);
    return NextResponse.json(
      { success: false, message: "Failed to send warning email." },
      { status: 500 }
    );
  }
}
