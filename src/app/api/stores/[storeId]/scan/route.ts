import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { checkScanRateLimit } from "@/src/lib/rateLimit";

export const dynamic = "force-dynamic";

// Helper function to check store access
async function verifyStoreAccess(userId: string, storeId: string) {
  const userStore = await prisma.userStore.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
  });
  return !!userStore;
}

// Substring & word-intersection matcher to cross-reference detected items with store DB products
function findExistingMatch(detectedName: string, existingProducts: any[]) {
  const cleanDetected = detectedName.toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const prod of existingProducts) {
    const cleanProd = prod.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanDetected.includes(cleanProd) || cleanProd.includes(cleanDetected)) {
      return prod;
    }

    // Word intersection check
    const detectedWords = cleanDetected.split(/\s+/).filter((w: string) => w.length > 2);
    const prodWords = cleanProd.split(/\s+/).filter((w: string) => w.length > 2);
    const common = detectedWords.filter((w: string) => prodWords.includes(w));
    if (common.length >= 2) {
      return prod;
    }
  }

  return null;
}

/**
 * OpenRouter Vision Fallback Provider:
 * Triggered specifically when Gemini API returns a 429 Rate Limit / Quota Exceeded error.
 */
async function analyzeWithOpenRouter(base64Data: string, mimeType: string) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    throw new Error("Gemini API rate limit reached & OPENROUTER_API_KEY is not configured.");
  }

  const prompt = `
You are an expert Kirana store inventory computer vision model.
Analyze the uploaded shelf or product photo carefully.
Identify all distinct FMCG products visible in the image.
For each item detected, provide your best estimation:
1. 'name': Exact packaging product name (e.g. "Maggi 70g Masala Noodles", "Lays Classic Salted 50g", "Amul Gold 500ml Milk")
2. 'estimated_quantity': Approximate count visible on shelf (integer >= 1)
3. 'confidence': 'high', 'medium', or 'low'
4. 'category': FMCG category (e.g. 'Instant Noodles', 'Biscuits', 'Dairy & Eggs', 'Edible Oil', 'Staples & Spices', 'Beverages', 'Personal Care', 'General FMCG')
5. 'unit': Inventory unit ('pkts', 'pouches', 'tins', 'kg', 'bottles', 'units')
6. 'estimated_price': Estimated retail price in INR (number)

Return structured JSON strictly adhering to this schema:
{
  "detected_items": [
    {
      "name": "Maggi 70g Masala Noodles",
      "estimated_quantity": 12,
      "confidence": "high",
      "category": "Instant Noodles",
      "unit": "pkts",
      "estimated_price": 14.0
    }
  ],
  "notes": "Clear lighting, 3 distinct product SKUs detected in image"
}
If the photo is too dark, blurry, or no Kirana products are visible, return an empty array for 'detected_items' with descriptive notes.
`;

  const candidateOpenRouterModels = [
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-flash-1.5:free",
    "meta-llama/llama-3.2-11b-vision-instruct",
    "qwen/qwen-2-vl-72b-instruct",
    "mistralai/pixtral-12b",
  ];

  let lastErr: any = null;

  for (const modelName of candidateOpenRouterModels) {
    try {
      console.log(`[OPENROUTER_VISION_REQUEST] Attempting OpenRouter model '${modelName}'...`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "StockSaathi AI Vision Scanner",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter HTTP ${response.status}: ${errorText}`);
      }

      const resData = await response.json();
      let contentText = resData.choices?.[0]?.message?.content || "";
      console.log(`[OPENROUTER_VISION_RAW_RESPONSE] Model '${modelName}' succeeded:`, contentText);

      // Clean Markdown code block wrappers if model returns ```json ... ```
      if (contentText.includes("```")) {
        contentText = contentText.replace(/^```json/m, "").replace(/^```/m, "").replace(/```$/m, "").trim();
      }

      const parsed = JSON.parse(contentText);
      return {
        detectedItems: parsed.detected_items || [],
        notes: parsed.notes || `OpenRouter vision analysis completed via ${modelName}`,
        provider: "openrouter",
      };
    } catch (err: any) {
      console.warn(`[OPENROUTER_MODEL_FAILED] '${modelName}':`, err.message || err);
      lastErr = err;
    }
  }

  throw new Error(`OpenRouter vision fallback failed: ${lastErr?.message || "All models failed"}`);
}

/**
 * Primary Vision Analyzer Function with Automatic Fallback Abstraction:
 * 1. Primary: Google Gemini API (gemini-2.0-flash / gemini-2.0-flash-lite)
 * 2. Fallback: OpenRouter Vision API (triggered ONLY on Gemini 429 Rate Limit)
 */
async function analyzeShelfImage(base64Data: string, mimeType: string, fileSizeBytes: number) {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  const candidateGeminiModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
  const prompt = `
You are an expert Kirana store inventory computer vision model.
Analyze the uploaded shelf or product photo carefully.
Identify all distinct FMCG products visible in the image.
For each item detected, provide your best estimation:
1. 'name': Exact packaging product name (e.g. "Maggi 70g Masala Noodles", "Lays Classic Salted 50g", "Amul Gold 500ml Milk")
2. 'estimated_quantity': Approximate count visible on shelf (integer >= 1)
3. 'confidence': 'high', 'medium', or 'low'
4. 'category': FMCG category (e.g. 'Instant Noodles', 'Biscuits', 'Dairy & Eggs', 'Edible Oil', 'Staples & Spices', 'Beverages', 'Personal Care', 'General FMCG')
5. 'unit': Inventory unit ('pkts', 'pouches', 'tins', 'kg', 'bottles', 'units')
6. 'estimated_price': Estimated retail price in INR (number)

Return structured JSON strictly adhering to this schema:
{
  "detected_items": [
    {
      "name": "Maggi 70g Masala Noodles",
      "estimated_quantity": 12,
      "confidence": "high",
      "category": "Instant Noodles",
      "unit": "pkts",
      "estimated_price": 14.0
    }
  ],
  "notes": "Clear lighting, 3 distinct product SKUs detected in image"
}
If the photo is too dark, blurry, or no Kirana products are visible, return an empty array for 'detected_items' with descriptive notes.
`;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };

  let geminiHitRateLimit = false;
  let lastGeminiError: any = null;

  if (geminiApiKey) {
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    for (const modelName of candidateGeminiModels) {
      try {
        console.log(`[GEMINI_VISION_REQUEST] Primary attempt '${modelName}' (${fileSizeBytes} bytes)...`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
          },
        });

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        console.log(`[GEMINI_VISION_RAW_RESPONSE] '${modelName}' succeeded:`, responseText);
        const parsed = JSON.parse(responseText);

        return {
          detectedItems: parsed.detected_items || [],
          notes: parsed.notes || `Gemini vision analysis completed via ${modelName}`,
          provider: "gemini",
        };
      } catch (err: any) {
        console.warn(`[GEMINI_VISION_MODEL_FAILED] '${modelName}':`, err.message || err);
        lastGeminiError = err;
        const errMsg = err.message || "";
        if (errMsg.includes("429") || errMsg.includes("Quota exceeded") || errMsg.includes("quota")) {
          geminiHitRateLimit = true;
        }
      }
    }
  }

  // If Gemini failed due to 429 Rate Limit, invoke OpenRouter fallback!
  if (geminiHitRateLimit || !geminiApiKey) {
    console.warn(`[VISION_FALLBACK_TRIGGERED] Gemini API hit 429 rate limit. Invoking OpenRouter vision provider fallback...`);
    try {
      return await analyzeWithOpenRouter(base64Data, mimeType);
    } catch (openRouterErr: any) {
      console.error("[OPENROUTER_FALLBACK_FAILED]:", openRouterErr);
      throw new Error("Too many scans right now — please wait a moment and try again.");
    }
  }

  // Non-429 Gemini error (e.g. malformed request)
  throw new Error(`Google Gemini Vision API error: ${lastGeminiError?.message || "Failed to reach vision provider"}`);
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { storeId } = params;

    // 1. Multi-Tenant Authorization Check
    const hasAccess = await verifyStoreAccess(userId, storeId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to this store" },
        { status: 403 }
      );
    }

    // 2. Application-Level Rate Limiting (Max 15 scans per store per 1 min)
    const scanAllowed = await checkScanRateLimit(storeId);
    if (!scanAllowed) {
      return NextResponse.json(
        { error: "Too many scans right now — please wait a moment and try again." },
        { status: 429 }
      );
    }

    // 3. Parse Image Input (Multipart Form Data or JSON Base64)
    let base64Data = "";
    let mimeType = "image/jpeg";
    let fileSizeBytes = 0;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 });
      }

      mimeType = file.type;
      fileSizeBytes = file.size;

      const buffer = await file.arrayBuffer();
      base64Data = Buffer.from(buffer).toString("base64");
    } else {
      const body = await req.json();
      if (!body.image) {
        return NextResponse.json({ error: "No base64 image string provided" }, { status: 400 });
      }

      const match = body.image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      } else {
        base64Data = body.image;
      }
      fileSizeBytes = Math.round((base64Data.length * 3) / 4);
    }

    // 4. Server-Side File Security Validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(mimeType.toLowerCase())) {
      return NextResponse.json(
        { error: "Unsupported image format. Please upload a JPG, PNG, or WebP photo." },
        { status: 400 }
      );
    }

    const MAX_SIZE = 8 * 1024 * 1024; // 8MB max
    if (fileSizeBytes > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image file is too large. Maximum allowed size is 8MB." },
        { status: 400 }
      );
    }

    // 5. Fetch Existing Store Products for Cross-Referencing
    const existingProducts = await prisma.product.findMany({
      where: { storeId },
    });

    // 6. Abstracted Vision Analysis Execution (Gemini Primary -> OpenRouter Fallback on 429)
    let analysisResult;
    try {
      analysisResult = await analyzeShelfImage(base64Data, mimeType, fileSizeBytes);
    } catch (analysisErr: any) {
      console.error("[VISION_ANALYSIS_FAILED]:", analysisErr.message);
      const isRateLimit = analysisErr.message.includes("Too many scans");
      return NextResponse.json(
        { error: analysisErr.message || "Failed to analyze shelf photo." },
        { status: isRateLimit ? 429 : 500 }
      );
    }

    const { detectedItems: detectedRawItems, notes, provider } = analysisResult;
    console.log(`[VISION_SCAN_SUCCESS] Photo successfully analyzed by provider: '${provider}'`);

    if (detectedRawItems.length === 0) {
      return NextResponse.json(
        {
          detected_items: [],
          notes: notes || "Couldn't clearly identify items — try a closer or better-lit photo.",
          provider,
        },
        { status: 200 }
      );
    }

    // 7. Cross-Reference Detected Items with Existing Store Products
    const itemsWithCrossReference = detectedRawItems.map((item: any, idx: number) => {
      const match = findExistingMatch(item.name, existingProducts);
      if (match) {
        return {
          id: `scan-item-${idx}`,
          action: "UPDATE_EXISTING",
          existingProductId: match.id,
          name: match.name, // Default to matched existing product name
          category: match.category || item.category || "General FMCG",
          quantity: item.estimated_quantity || 1,
          unit: match.unit || item.unit || "pkts",
          price: match.price || item.estimated_price || 0,
          confidence: item.confidence || "high",
          included: true,
        };
      } else {
        return {
          id: `scan-item-${idx}`,
          action: "CREATE_NEW",
          name: item.name,
          category: item.category || "General FMCG",
          quantity: item.estimated_quantity || 1,
          unit: item.unit || "pkts",
          price: item.estimated_price || 0,
          confidence: item.confidence || "high",
          included: true,
        };
      }
    });

    // 8. Persist ScanResult in Database with Provider Metadata
    let scanId = `scan-${Date.now()}`;
    try {
      const scanResultRecord = await prisma.scanResult.create({
        data: {
          storeId,
          userId,
          rawModelOutput: JSON.stringify({
            provider,
            items: itemsWithCrossReference,
          }),
          applied: false,
        },
      });
      scanId = scanResultRecord.id;
    } catch (dbErr) {
      console.warn("ScanResult database log skipped:", dbErr);
    }

    return NextResponse.json({
      scanId,
      detected_items: itemsWithCrossReference,
      notes,
      provider,
    });
  } catch (error: any) {
    console.error("POST /api/stores/[storeId]/scan error:", error);
    return NextResponse.json(
      { error: "Failed to analyze shelf photo. Please try again." },
      { status: 500 }
    );
  }
}
