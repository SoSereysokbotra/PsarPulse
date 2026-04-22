/**
 * Check Telegram Webhook Status
 * Run this to verify the webhook is working
 *
 * Usage: node scripts/check-telegram-webhook.js
 */

// Load .env file
require("dotenv").config({ path: ".env" });

const TELEGRAM_API = "https://api.telegram.org";

async function checkWebhook() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.error("❌ TELEGRAM_BOT_TOKEN not set");
    process.exit(1);
  }

  try {
    console.log("🔍 Checking Telegram webhook status...\n");

    // Get webhook info
    const infoResponse = await fetch(
      `${TELEGRAM_API}/bot${botToken}/getWebhookInfo`,
    );
    const infoResult = await infoResponse.json();

    if (!infoResult.ok) {
      console.error("❌ Failed to get webhook info:", infoResult);
      process.exit(1);
    }

    const webhookInfo = infoResult.result;

    console.log("✅ Webhook Status:");
    console.log(`   URL: ${webhookInfo.url || "❌ NOT SET"}`);
    console.log(`   Last error date: ${webhookInfo.last_error_date || "None"}`);
    console.log(
      `   Last error message: ${webhookInfo.last_error_message || "None"}`,
    );
    console.log(`   Pending update count: ${webhookInfo.pending_update_count}`);
    console.log(
      `   Allowed updates: ${JSON.stringify(webhookInfo.allowed_updates)}`,
    );
    console.log(
      `   Has custom certificate: ${webhookInfo.has_custom_certificate}`,
    );

    if (!webhookInfo.url) {
      console.log("\n⚠️  Webhook URL is not set!");
      console.log("   Run: node scripts/setup-telegram-webhook.js");
      process.exit(1);
    }

    if (webhookInfo.last_error_message) {
      console.log(
        `\n⚠️  Recent webhook error: ${webhookInfo.last_error_message}`,
      );
      console.log(
        `   Last error was ${webhookInfo.last_error_date} seconds ago`,
      );
    } else {
      console.log("\n✅ Webhook is working correctly!");
    }

    // Get pending updates (button clicks waiting to be processed)
    if (webhookInfo.pending_update_count > 0) {
      console.log(
        `\n📦 You have ${webhookInfo.pending_update_count} pending updates waiting to be processed`,
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkWebhook();
