import { prisma } from "@/src/lib/prisma";

/**
 * DB-backed Rate Limiter:
 * Checks number of login/signup attempts for a given email within a 10-minute window.
 * Returns true if allowed, false if limit (5 attempts per 10 mins) is exceeded.
 */
export async function checkRateLimit(email: string, ip?: string): Promise<boolean> {
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxAttempts = 5;
  const cutoff = new Date(Date.now() - windowMs);

  try {
    const attemptsCount = await prisma.loginAttempt.count({
      where: {
        email: email.toLowerCase(),
        attemptedAt: {
          gte: cutoff,
        },
      },
    });

    return attemptsCount < maxAttempts;
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open in dev if DB is unreachable to prevent developer lockout
    return true;
  }
}

/**
 * Records a failed or rate-tracked login/signup attempt in DB.
 */
export async function recordAttempt(email: string, ip?: string): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: {
        email: email.toLowerCase(),
        ip: ip || "unknown",
      },
    });
  } catch (error) {
    console.error("Record attempt failed:", error);
  }
}
