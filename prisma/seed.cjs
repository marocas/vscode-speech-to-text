require('dotenv/config');

async function main() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient({});

  await prisma.$connect();
  console.log('Prisma connection verified successfully.');

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
