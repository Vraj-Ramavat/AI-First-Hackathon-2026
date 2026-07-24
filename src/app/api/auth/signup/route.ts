import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { checkRateLimit, recordAttempt } from "@/src/lib/rateLimit";

export const dynamic = "force-dynamic";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  storeName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name, storeName } = validation.data;

    // 2. Rate Limiting Check
    const allowed = await checkRateLimit(email);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts, please try again later" },
        { status: 429 }
      );
    }

    // 3. Duplicate Email Check
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      await recordAttempt(email);
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 400 }
      );
    }

    // 4. Hash Password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Create User, Default Store, and UserStore link in a Transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          name: name || email.split("@")[0],
        },
      });

      // Create default Kirana store for the new user
      const store = await tx.store.create({
        data: {
          name: storeName || `${user.name}'s Kirana Store`,
          location: "Ahmedabad, Gujarat",
        },
      });

      // Link User & Store as Owner
      await tx.userStore.create({
        data: {
          userId: user.id,
          storeId: store.id,
          role: "owner",
        },
      });

      // Seed initial default products for realistic Kirana demo
      await tx.product.createMany({
        data: [
          {
            storeId: store.id,
            name: "Maggi 70g Masala Noodles",
            category: "Instant Noodles",
            quantity: 8,
            unit: "pkts",
            price: 14.0,
            lowStockThreshold: 15,
            stockLevelPercent: 12,
            status: "CRITICAL",
          },
          {
            storeId: store.id,
            name: "Fortune Sunlite Oil 1L",
            category: "Edible Oil",
            quantity: 6,
            unit: "tins",
            price: 165.0,
            lowStockThreshold: 15,
            stockLevelPercent: 15,
            status: "CRITICAL",
          },
          {
            storeId: store.id,
            name: "Parle-G 80g Biscuit",
            category: "Biscuits",
            quantity: 22,
            unit: "pkts",
            price: 10.0,
            lowStockThreshold: 20,
            stockLevelPercent: 28,
            status: "LOW",
          },
          {
            storeId: store.id,
            name: "Amul Taaza Milk 500ml",
            category: "Dairy & Eggs",
            quantity: 42,
            unit: "pouches",
            price: 27.0,
            lowStockThreshold: 15,
            stockLevelPercent: 85,
            status: "IN_STOCK",
          },
          {
            storeId: store.id,
            name: "Tata Salt 1kg Pack",
            category: "Staples & Spices",
            quantity: 58,
            unit: "pkts",
            price: 28.0,
            lowStockThreshold: 15,
            stockLevelPercent: 90,
            status: "IN_STOCK",
          },
        ],
      });

      return { user, store };
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        userId: result.user.id,
        storeId: result.store.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
