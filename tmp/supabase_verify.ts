import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function findAndVerifyUser(email: string) {
  try {
    console.log(`Searching for user with email: ${email} in Supabase Auth...`);
    
    // 1. List users to find the one with the given email
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) throw error;
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log(`User ${email} not found in Supabase Auth.`);
      return;
    }
    
    console.log(`Found user: ${user.id}`);
    console.log(`Current status: ${user.email_confirmed_at ? "Confirmed" : "Unconfirmed"}`);
    
    if (!user.email_confirmed_at) {
      console.log("Manually confirming email...");
      const { data, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );
      if (updateError) throw updateError;
      console.log("Email confirmed successfully!");
    } else {
      console.log("Email is already confirmed.");
    }
    
    return user;
  } catch (error) {
    console.error("Error in findAndVerifyUser:", error);
  }
}

const email = process.argv[2];
if (!email) {
  console.error("Please provide an email address.");
  process.exit(1);
}

findAndVerifyUser(email);
