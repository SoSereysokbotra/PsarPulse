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

async function listAllSupabaseUsers() {
  try {
    console.log("Listing all users from Supabase Auth...");
    
    const { data: { users }, error } = await supabase.auth.admin.listUsers({
      perPage: 1000
    });
    
    if (error) throw error;
    
    console.log(`Found ${users.length} users in Supabase Auth.`);
    
    const userSummary = users.map(u => ({
      id: u.id,
      email: u.email,
      confirmed: !!u.email_confirmed_at,
      last_sign_in: u.last_sign_in_at
    }));
    
    console.log(JSON.stringify(userSummary, null, 2));

    const targetEmail = "noeun.tithearin25@kit.edu.kh";
    const found = users.find(u => u.email === targetEmail);
    if (found) {
        console.log(`\nTARGET USER FOUND: ${found.id}`);
    } else {
        console.log(`\nTARGET USER NOT FOUND in Supabase Auth list.`);
    }

  } catch (error) {
    console.error("Error listing users:", error);
  }
}

listAllSupabaseUsers();
