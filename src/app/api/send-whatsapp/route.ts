import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Server-Side Zero-Click WhatsApp Message Dispatcher Endpoint
 * 
 * Delivers automatic WhatsApp alerts directly to the owner's phone without requiring
 * WhatsApp Web tab opening or Enter key presses.
 * 
 * Supports:
 * 1. CallMeBot Free WhatsApp Gateway API (CALLMEBOT_API_KEY)
 * 2. Twilio WhatsApp Business API (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
 * 3. Custom Webhook / GreenAPI / UltraMsg Integration
 */
export async function POST(req: Request) {
  try {
    const { phone, message, apiKey, storeName } = await req.json();

    if (!phone || !message) {
      return NextResponse.json(
        { error: "Phone number and message text are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const effectiveCallMeBotKey = apiKey || process.env.CALLMEBOT_API_KEY;

    // 1. Try CallMeBot Free Direct WhatsApp API (Zero-click delivery straight to WhatsApp app)
    if (effectiveCallMeBotKey) {
      try {
        console.log(`[CALLMEBOT_DISPATCH] Sending zero-click WhatsApp message to +${formattedPhone}...`);
        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=+${formattedPhone}&text=${encodeURIComponent(message)}&apikey=${effectiveCallMeBotKey}`;
        const botRes = await fetch(callMeBotUrl);
        const responseText = await botRes.text();

        if (botRes.ok && !responseText.toLowerCase().includes("error")) {
          return NextResponse.json({
            success: true,
            provider: "callmebot",
            message: `Zero-click WhatsApp alert automatically delivered to +${formattedPhone} from ${storeName || "store"}!`,
          });
        } else {
          console.warn(`[CALLMEBOT_FAILED] ${responseText}`);
        }
      } catch (callMeBotErr: any) {
        console.warn("[CALLMEBOT_ERROR]:", callMeBotErr.message);
      }
    }

    // 2. Try Twilio WhatsApp API
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER;

    if (twilioSid && twilioAuthToken && twilioPhone) {
      try {
        const authBuffer = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");
        const params = new URLSearchParams();
        params.append("From", twilioPhone.startsWith("whatsapp:") ? twilioPhone : `whatsapp:${twilioPhone}`);
        params.append("To", `whatsapp:+${formattedPhone}`);
        params.append("Body", message);

        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${authBuffer}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          }
        );

        if (twilioRes.ok) {
          return NextResponse.json({
            success: true,
            provider: "twilio",
            message: `Zero-click WhatsApp message dispatched via Twilio to +${formattedPhone} for ${storeName}`,
          });
        }
      } catch (twilioErr: any) {
        console.warn("[TWILIO_ERROR]:", twilioErr.message);
      }
    }

    // 3. Fallback: Log Server-Side Auto-Dispatch & Return WhatsApp Direct Launch Link
    console.log(`[ZERO_CLICK_WHATSAPP_SIMULATED] Automatic alert for ${storeName || "Store"} -> +${formattedPhone}:\n${message}`);

    return NextResponse.json({
      success: true,
      provider: "direct_link_fallback",
      message: `Automatic alert generated for ${storeName || "Store"}. (Tip: Add a CallMeBot API key for 100% background zero-click sending).`,
      whatsappUrl: `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`,
      requiresCallMeBotKey: !effectiveCallMeBotKey,
    });
  } catch (error: any) {
    console.error("POST /api/send-whatsapp error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch zero-click WhatsApp message" },
      { status: 500 }
    );
  }
}
