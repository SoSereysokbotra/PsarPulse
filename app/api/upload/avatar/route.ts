import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads", "avatars");
    
    // Ensure directory exists (again, just in case)
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const fileName = `${payload.id}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = join(uploadDir, fileName);
    const publicPath = `/uploads/avatars/${fileName}`;

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: publicPath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
