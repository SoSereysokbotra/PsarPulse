import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET() {
  try {
    const cwd = process.cwd(); 

    // Execute the Python script. 
    // This assumes `python` is available in your system's PATH.
    const { stdout } = await execAsync("python ml/predict.py", { cwd });
    
    // predict.py prints a JSON string natively when it completes
    // We want to extract just the JSON part in case there's other print statements
    const jsonStart = stdout.indexOf("{");
    const jsonEnd = stdout.lastIndexOf("}");
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid output format from Python script");
    }
    
    const parsedData = JSON.parse(stdout.substring(jsonStart, jsonEnd + 1));

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("ML Prediction Exec Error:", error);
    return NextResponse.json(
      { success: false, message: "Python execution failed." },
      { status: 500 }
    );
  }
}
