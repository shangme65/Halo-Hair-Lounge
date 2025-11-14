import { prisma } from "./src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function applyRLS() {
  try {
    console.log("Reading RLS migration file...");
    const sqlPath = path.join(
      __dirname,
      "prisma",
      "migrations",
      "rls_policies.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf-8");

    console.log("Applying Row Level Security policies...");

    // Split by semicolon and execute each statement
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 60)}...`);
        await prisma.$executeRawUnsafe(statement + ";");
      }
    }

    console.log("✅ RLS policies applied successfully!");
  } catch (error) {
    console.error("❌ Error applying RLS policies:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyRLS();
