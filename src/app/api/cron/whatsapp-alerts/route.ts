import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Automated 2-Hour WhatsApp Alert Cron / Webhook Endpoint
 * 
 * Can be called every 2 hours by Vercel Cron, GitHub Actions, or local background timers.
 * Checks all active store inventories, identifies low-stock & critical items,
 * and dispatches automatic WhatsApp alerts via Twilio (if configured) or logs alerts.
 */
export async function GET(req: Request) {
  try {
    // 1. Fetch all stores with low-stock products
    const stores = await prisma.store.findMany({
      include: {
        products: {
          where: {
            quantity: {
              lte: 15,
            },
          },
        },
        userStores: {
          include: {
            user: true,
          },
        },
      },
    });

    const alertSummaries: any[] = [];

    for (const store of stores) {
      const lowStockProducts = store.products.filter(
        (p) => p.quantity <= p.lowStockThreshold || p.quantity <= 5
      );

      if (lowStockProducts.length === 0) continue;

      const ownerEmail = store.userStores[0]?.user?.email || "owner@kirana.com";
      const ownerName = store.userStores[0]?.user?.name || "Kirana Store Owner";

      // Formulate formatted WhatsApp alert text
      let text = `🛒 *StockSaathi Automated 2-Hour Inventory Alert*\n`;
      text += `🏪 Store: *${store.name}*\n\n`;
      text += `⚠️ *Low Stock Items Requiring Restock:* \n`;
      lowStockProducts.forEach((p) => {
        const statusTag = p.quantity <= 5 ? "(CRITICAL)" : "(Low Stock)";
        text += `• *${p.name}*: ${p.quantity} ${p.unit} remaining ${statusTag}\n`;
      });
      text += `\n📦 *Action Suggested:* Please reorder with your FMCG distributor today.\n\n_Automated 2-Hour Schedule by StockSaathi_`;

      let sentViaTwilio = false;
      let twilioError: string | null = null;

      // Send via Twilio WhatsApp API if environment variables are present
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. "whatsapp:+14155238886"
      const targetPhone = process.env.OWNER_WHATSAPP_NUMBER || "whatsapp:+919876543210";

      if (twilioSid && twilioAuthToken && twilioPhone) {
        try {
          const authBuffer = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");
          const params = new URLSearchParams();
          params.append("From", twilioPhone.startsWith("whatsapp:") ? twilioPhone : `whatsapp:${twilioPhone}`);
          params.append("To", targetPhone.startsWith("whatsapp:") ? targetPhone : `whatsapp:${targetPhone}`);
          params.append("Body", text);

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
            sentViaTwilio = true;
          } else {
            const errJson = await twilioRes.json();
            twilioError = errJson.message || "Twilio request failed";
          }
        } catch (err: any) {
          twilioError = err.message;
        }
      }

      alertSummaries.push({
        storeId: store.id,
        storeName: store.name,
        ownerEmail,
        ownerName,
        lowStockItemCount: lowStockProducts.length,
        items: lowStockProducts.map((p) => ({ name: p.name, qty: p.quantity, unit: p.unit })),
        messageText: text,
        sentViaTwilio,
        twilioError,
        scheduledAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `2-Hour Automated WhatsApp scan completed. Audited ${stores.length} stores.`,
      alertCount: alertSummaries.length,
      alerts: alertSummaries,
    });
  } catch (error: any) {
    console.error("GET /api/cron/whatsapp-alerts error:", error);
    return NextResponse.json(
      { error: "Failed to run automated WhatsApp 2-hour cron scan" },
      { status: 500 }
    );
  }
}
