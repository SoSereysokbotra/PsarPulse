import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you there?");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("Error with gemini-1.5-flash:", error.message);
    
    // Fallback to older model or try latest
    try {
        console.log("Trying gemini-1.5-flash-latest...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result2 = await model2.generateContent("Hello?");
        console.log("Response with latest:", result2.response.text());
    } catch(err2) {
        console.error("Error with gemini-1.5-flash-latest:", err2.message);
        
        try {
            console.log("Trying gemini-pro...");
            const model3 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result3 = await model3.generateContent("Hello?");
            console.log("Response with gemini-pro:", result3.response.text());
        } catch(err3) {
            console.error("Error with gemini-pro:", err3.message);
        }
    }
  }
}

run();
