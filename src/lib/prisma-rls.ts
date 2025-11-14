import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

// Helper to create a Prisma client with session context for RLS
export function getPrismaWithContext(userId?: string, userRole?: string) {
  return prisma.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        // Set session context before query
        if (userId && userRole) {
          await prisma.$executeRawUnsafe(
            `SELECT set_session_context('${userId}', '${userRole}')`
          );
        }

        try {
          // Execute the query
          const result = await query(args);
          return result;
        } finally {
          // Clear context after query
          if (userId && userRole) {
            await prisma.$executeRawUnsafe(`SELECT clear_session_context()`);
          }
        }
      },
    },
  });
}

export { prisma };
