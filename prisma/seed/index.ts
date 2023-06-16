import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const client = new PrismaClient();

const languageIconsPath = path.join(path.resolve(), 'prisma', 'seed', 'data');

const languagesList = [
  {
    code: 'en',
    iconPath: path.join(languageIconsPath, 'english-language-icon.jpeg'),
  },
  {
    code: 'ua',
    iconPath: path.join(languageIconsPath, 'ukraine-language-icon.png'),
  },
  {
    code: 'ja',
    iconPath: path.join(languageIconsPath, 'japan-language-icon.png'),
  },
];

async function checkEnglishLanguageExistance() {
  for (const languageItem of languagesList) {
    const check = await client.language.findFirst({
      where: {
        code: languageItem.code,
      },
    });

    if (!check) {
      const languageIcon = await fs.readFile(languageItem.iconPath);

      await client.language.create({
        data: {
          code: languageItem.code,
          icon: {
            create: {
              icon: languageIcon,
            },
          },
        },
      });
    }
  }
}

async function seed() {
  await checkEnglishLanguageExistance();
}

seed();
