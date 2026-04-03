import dotenv from "dotenv";
dotenv.config();

async function run() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    if (data.models) {
        console.log("Your API key has access to these models:");
        console.log(data.models.map(m => m.name).join("\n"));
    } else {
        console.log("Error or no models:", data);
    }
  } catch (err) {
    console.error("Fetch failed", err);
  }
}
run();
