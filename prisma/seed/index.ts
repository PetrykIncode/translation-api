import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const client = new PrismaClient();

async function checkEnglishLanguageExistance() {
  const englishLanguage = await client.language.findMany({
    where: {
      code: 'en',
    },
  });

  if (englishLanguage.length === 0) {
    const englishLanguageIcon = await fs.readFile(
      path.join(
        path.resolve(),
        'prisma',
        'seed',
        'data',
        'english-language-icon.jpeg',
      ),
    );

    await client.language.create({
      data: {
        code: 'en',
        icon: {
          create: {
            icon: englishLanguageIcon,
          },
        },
      },
    });
  }
}

async function seed() {
  await checkEnglishLanguageExistance();
}

seed();
