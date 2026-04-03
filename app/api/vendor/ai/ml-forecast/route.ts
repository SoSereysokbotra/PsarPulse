import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const artifactPath = path.join(
    process.cwd(),
    "ml",
    "artifacts",
    "next_day_prediction.json",
  );

  try {
    const raw = await fs.readFile(artifactPath, "utf-8");
    const data = JSON.parse(raw);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ML Forecast GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "ML model artifact not found. Run the Python training pipeline first.",
      },
      { status: 503 },
    );
  }
}
