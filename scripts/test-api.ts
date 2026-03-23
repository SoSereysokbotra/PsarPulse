import { config } from "dotenv";
config({ path: ".env" });
import { TokenUtil } from "../lib/auth/utils/token.util";

async function runTest() {
  const token = TokenUtil.generateAccessToken({
    id: "75bb2c67-3a57-4c9a-8eb8-0424377b50e1",
    email: "superadmin@example.com",
    role: "super_admin",
  });

  console.log("Generated token:", token.substring(0, 20) + "...");

  const res = await fetch("http://localhost:3000/api/admin/vendor-requests", {
    headers: {
      Cookie: `access_token=${token}`,
    },
  });

  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}

runTest().catch(console.error);
