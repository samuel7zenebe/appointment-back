import { prisma } from "./src/prisma/client";

async function main() {
  try {
    await prisma.$connect();

    console.log("✅ Connected to Neon successfully");

    const result = await prisma.$queryRaw`SELECT NOW()`;

    console.log("Database response:", result);
  } catch (error) {
    console.error("❌ Connection failed");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
