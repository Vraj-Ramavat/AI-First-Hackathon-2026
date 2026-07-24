import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  category: z.string().optional(),
  quantity: z.number().int().min(0, "Quantity must be non-negative").optional(),
  unit: z.string().optional(),
  price: z.number().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
});

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

export async function PUT(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { productId } = params;

    // 1. Look up target product's REAL store_id directly from the database
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 2. CRITICAL SECURITY GUARD: Verify user access to the product's REAL store_id
    const hasAccess = await verifyStoreAccess(userId, existingProduct.storeId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to modify product in this store" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = updateProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const updates = validation.data;
    const newQuantity = updates.quantity !== undefined ? updates.quantity : existingProduct.quantity;
    const newThreshold = updates.lowStockThreshold !== undefined ? updates.lowStockThreshold : existingProduct.lowStockThreshold;

    const maxCapacity = Math.max(newThreshold * 3, 50);
    const stockLevelPercent = Math.min(100, Math.round((newQuantity / maxCapacity) * 100));
    let status = "IN_STOCK";
    if (stockLevelPercent <= 20) status = "CRITICAL";
    else if (stockLevelPercent <= 40) status = "LOW";

    // Update only allowed fields (mass-assignment protection)
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.category && { category: updates.category }),
        ...(updates.quantity !== undefined && { quantity: updates.quantity }),
        ...(updates.unit && { unit: updates.unit }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.lowStockThreshold !== undefined && { lowStockThreshold: updates.lowStockThreshold }),
        stockLevelPercent,
        status,
      },
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error: any) {
    console.error("PUT product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { productId } = params;

    // 1. Look up target product's REAL store_id directly from the database
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 2. CRITICAL SECURITY GUARD: Verify user access to the product's REAL store_id
    const hasAccess = await verifyStoreAccess(userId, existingProduct.storeId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to delete product in this store" },
        { status: 403 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
