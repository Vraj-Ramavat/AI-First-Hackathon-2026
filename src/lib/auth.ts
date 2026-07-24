import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { checkRateLimit, recordAttempt } from "@/src/lib/rateLimit";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        // 1. Validate Input Schema with Zod
        const validation = loginSchema.safeParse(credentials);
        if (!validation.success) {
          throw new Error("Invalid email or password");
        }

        const { email, password } = validation.data;

        // 2. Check Rate Limits (Max 5 attempts per 10 min)
        const allowed = await checkRateLimit(email);
        if (!allowed) {
          throw new Error("Too many attempts, please try again later");
        }

        // 3. Find User in DB
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          await recordAttempt(email);
          throw new Error("Invalid email or password");
        }

        // 4. Verify Bcrypt Hashed Password
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
          await recordAttempt(email);
          throw new Error("Invalid email or password");
        }

        // 5. Return authenticated user payload
        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split("@")[0],
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
