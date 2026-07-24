import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().optional(),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
  unit: z.string().default("pkts"),
  price: z.number().min(0, "Price must be non-negative").optional().default(0),
  lowStockThreshold: z.number().int().min(0).optional().default(15),
});

// Helper function to check if user has access to a specific store
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

export async function GET(
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

    // Strict Server-Side Multi-Tenant Authorization Check
    const hasAccess = await verifyStoreAccess(userId, storeId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to this store" },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
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

    // Strict Server-Side Multi-Tenant Authorization Check
    const hasAccess = await verifyStoreAccess(userId, storeId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to this store" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, category, quantity, unit, price, lowStockThreshold } = validation.data;

    // Compute stock status percentages
    const maxCapacity = Math.max(lowStockThreshold * 3, 50);
    const stockLevelPercent = Math.min(100, Math.round((quantity / maxCapacity) * 100));
    let status = "IN_STOCK";
    if (stockLevelPercent <= 20) status = "CRITICAL";
    else if (stockLevelPercent <= 40) status = "LOW";

    const product = await prisma.product.create({
      data: {
        storeId, // Taken from verified server-side route params after UserStore check
        name,
        category: category || "General FMCG",
        quantity,
        unit,
        price,
        lowStockThreshold,
        stockLevelPercent,
        status,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("POST product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
