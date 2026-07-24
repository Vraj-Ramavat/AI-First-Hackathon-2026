import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

const createStoreSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  location: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch stores user has access to via UserStore join table
    const userStores = await prisma.userStore.findMany({
      where: { userId },
      include: {
        store: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const stores = userStores.map((us) => ({
      id: us.store.id,
      name: us.store.name,
      location: us.store.location,
      role: us.role,
      createdAt: us.store.createdAt,
    }));

    return NextResponse.json({ stores });
  } catch (error: any) {
    console.error("GET /api/stores error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const validation = createStoreSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, location } = validation.data;

    // Create Store + UserStore link in a transaction
    const store = await prisma.$transaction(async (tx) => {
      const newStore = await tx.store.create({
        data: {
          name,
          location: location || "India",
        },
      });

      await tx.userStore.create({
        data: {
          userId,
          storeId: newStore.id,
          role: "owner",
        },
      });

      return newStore;
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/stores error:", error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}
