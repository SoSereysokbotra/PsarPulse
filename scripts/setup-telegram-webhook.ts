/**
 * Setup Telegram Webhook
 * Run this once to register your webhook with Telegram
 *
 * Usage: npx ts-node scripts/setup-telegram-webhook.ts
 */

const TELEGRAM_API = "https://api.telegram.org";

async function setupWebhook() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!botToken) {
    console.error("❌ TELEGRAM_BOT_TOKEN not set");
    process.exit(1);
  }

  if (!appUrl) {
    console.error("❌ NEXT_PUBLIC_APP_URL not set");
    process.exit(1);
  }

  const webhookUrl = `${appUrl}/api/public/telegram/webhook`;

  console.log("🚀 Setting up Telegram webhook...");
  console.log(`📍 Webhook URL: ${webhookUrl}`);
  console.log(
    `🔐 Secret: ${webhookSecret ? "✓ Configured" : "❌ Not configured (optional)"}`,
  );

  try {
    // Set the webhook
    const setWebhookUrl = new URL(`/bot${botToken}/setWebhook`, TELEGRAM_API);
    const payload: Record<string, string | boolean> = {
      url: webhookUrl,
      allowed_updates: JSON.stringify(["callback_query"]), // Only receive button clicks
    };

    if (webhookSecret) {
      payload.secret_token = webhookSecret;
    }

    console.log("\n📤 Calling setWebhook...");
    const response = await fetch(setWebhookUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as Record<string, unknown>;

    if (!result.ok) {
      console.error("❌ Webhook setup failed:", result);
      process.exit(1);
    }

    console.log("✅ Webhook registered successfully!");

    // Get webhook info
    console.log("\n📋 Fetching webhook info...");
    const infoUrl = new URL(`/bot${botToken}/getWebhookInfo`, TELEGRAM_API);
    const infoResponse = await fetch(infoUrl.toString());
    const infoResult = (await infoResponse.json()) as Record<string, unknown>;

    if (infoResult.ok) {
      const webhookInfo = infoResult.result as Record<string, unknown>;
      console.log("\n✅ Webhook Info:");
      console.log(`   URL: ${webhookInfo.url}`);
      console.log(
        `   Has custom certificate: ${webhookInfo.has_custom_certificate}`,
      );
      console.log(
        `   Has secret: ${webhookInfo.url?.toString().includes(webhookSecret) ? "✓" : "❌"}`,
      );
      console.log(
        `   Allowed updates: ${JSON.stringify(webhookInfo.allowed_updates)}`,
      );
      console.log(
        `   Pending update count: ${webhookInfo.pending_update_count}`,
      );
    }

    console.log("\n✨ Telegram webhook is ready! Button clicks will now work.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Only allow running with proper environment
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("Error: TELEGRAM_BOT_TOKEN env variable is required");
  process.exit(1);
}

setupWebhook();
