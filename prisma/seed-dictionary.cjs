require('dotenv/config');

const DEV_TERMS = [
  // Languages & Frameworks
  'TypeScript', 'JavaScript', 'GraphQL', 'PostgreSQL', 'MongoDB',
  'Node.js', 'React', 'Vue.js', 'Next.js', 'Prisma', 'Tailwind',
  'Webpack', 'Vite', 'Electron', 'Express',
  // Dev keywords
  'async', 'await', 'const', 'boolean', 'useState', 'useEffect',
  'onClick', 'className', 'innerHTML', 'querySelector', 'localStorage',
  'setTimeout', 'middleware', 'endpoint', 'webhook', 'navbar', 'dropdown',
  // Tools & Platforms
  'GitHub', 'GitLab', 'npm', 'pnpm', 'Docker', 'Kubernetes',
  'Redis', 'Nginx', 'Vercel', 'Netlify', 'Supabase', 'AWS',
  'macOS', 'iOS', 'VS Code',
  // Acronyms
  'API', 'CLI', 'CSS', 'HTML', 'DOM', 'JSON', 'JWT',
  'HTTP', 'HTTPS', 'REST', 'SQL', 'SSH', 'URL', 'UUID',
  'YAML', 'CORS', 'CRUD', 'OAuth', 'SDK', 'ORM',
];

function getCategory(word) {
  if (word === word.toUpperCase() && word.length <= 5) return 'acronym';
  if (/^[A-Z]/.test(word)) return 'dev-terms';
  return 'dev-terms';
}

async function main() {
  const { PrismaClient } = require('../src/main/generated/prisma');
  const prisma = new PrismaClient();

  const userIdentifier = process.argv[2];
  if (!userIdentifier) {
    console.error('Usage: node prisma/seed-dictionary.cjs <user-id-or-email-or-username>');
    process.exit(1);
  }

  const rawIdentifier = userIdentifier.trim();
  const normalizedId = rawIdentifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: rawIdentifier }, { email: normalizedId }, { username: normalizedId }],
    },
  });

  if (!user) {
    console.error(`User not found: ${userIdentifier}`);
    process.exit(1);
  }

  console.log(`Seeding dictionary for user: ${user.username} (${user.id})`);

  let added = 0;
  let updated = 0;

  for (const word of DEV_TERMS) {
    const category = getCategory(word);
    try {
      const existing = await prisma.dictionary.findUnique({
        where: { userId_word: { userId: user.id, word } },
      });

      if (existing) {
        updated++;
      } else {
        await prisma.dictionary.create({
          data: { userId: user.id, word, category },
        });
        added++;
      }
    } catch (error) {
      console.error(`  Failed to add "${word}": ${error.message}`);
    }
  }

  console.log(`✓ Done: ${added} added, ${updated} already existed`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
