import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getPrismaWithContext } from "./prisma-rls";

/**
 * Get Prisma client with Row Level Security context
 * Automatically applies user's session context to enforce RLS policies
 *
 * @example
 * ```ts
 * const db = await getPrismaWithRLS();
 * const appointments = await db.appointment.findMany(); // Automatically filtered by RLS
 * ```
 */
export async function getPrismaWithRLS() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session?.user?.role) {
    // Return Prisma without context for unauthenticated requests
    // RLS policies will still apply (blocking most operations)
    return getPrismaWithContext();
  }

  return getPrismaWithContext(session.user.id, session.user.role);
}

/**
 * Check if user has admin privileges
 */
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

/**
 * Check if user has staff or admin privileges
 */
export async function isStaffOrAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
