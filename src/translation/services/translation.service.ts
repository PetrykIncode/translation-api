import { BadRequestException, Injectable } from '@nestjs/common';
import { TranslationKey } from '@prisma/client';
import * as XLSX from 'xlsx';

import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  GetTransactionsQuery,
  MakeTranslateDto,
  PatchTranslationDto,
} from '../dto';

@Injectable()
export class TranslationService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTranslation(data: MakeTranslateDto) {
    // If language `en` it means we create default translation
    let translationKey: TranslationKey;

    if (data.code !== 'en') {
      // Check if translation key exists
      translationKey = await this.prismaService.translationKey.findFirst({
        where: {
          key: data.key.toLowerCase(),
        },
      });

      if (!translationKey) {
        throw new BadRequestException('Translation `key` not exists');
      }
    } else {
      translationKey = await this.prismaService.translationKey.create({
        data: {
          key: data.key.toLowerCase(),
        },
      });
    }

    // Check if translation texts exists
    const textCandidate = await this.prismaService.translation.findFirst({
      where: {
        text: data.text,
      },
    });

    if (textCandidate) {
      throw new BadRequestException('Translation `text` should be unique');
    }

    // Check if language exists
    const languageCandidate = await this.prismaService.language.findFirst({
      where: {
        code: data.code.toLowerCase(),
      },
    });

    if (!languageCandidate) {
      throw new BadRequestException('Language `code` not exists');
    }

    return this.prismaService.translation.create({
      data: {
        text: data.text,
        keyId: translationKey.id,
        languageId: languageCandidate.id,
      },
    });
  }

  async getTranslations(query: GetTransactionsQuery) {
    const translations = await this.prismaService.translationKey.findMany({
      include: {
        translations: {
          include: {
            language: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });

    return translations;
  }

  async patchTranslation(id: string, data: PatchTranslationDto) {
    const candidate = await this.prismaService.translation.findFirst({
      where: {
        id,
      },
    });

    if (!candidate) {
      throw new BadRequestException('Translation not exists');
    }

    return this.prismaService.translation.update({
      where: {
        id,
      },
      data,
    });
  }

  async exportTable() {
    const translations = await this.prismaService.translationKey.findMany({
      include: {
        translations: {
          include: {
            language: true,
          },
        },
      },
    });

    const exportTable: Array<Array<string>> = [
      ['Key', 'Translation', 'Language'],
    ];

    for (let i = 0; i < translations.length; i++) {
      for (let j = 0; j < translations[i]?.translations?.length; j++) {
        exportTable.push([
          translations[i].key,
          translations[i].translations[j].text,
          translations[i].translations[j].language.code,
        ]);
      }
    }

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.aoa_to_sheet(exportTable);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
  }

  async importTranslations(data: BufferSource) {
    const workbook = XLSX.read(data);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const excelSheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Check Excel file header
    const checkHeader = ['Key', 'Translation', 'Language'];

    for (let i = 0; i < checkHeader.length; i++) {
      if (excelSheetData[0][i] !== checkHeader[i]) {
        throw new BadRequestException('Bad Excel file');
      }
    }

    // Check languages
    const languages = await this.prismaService.language.findMany();
    const languagesList = languages.map((item) => {
      return item.code;
    });

    for (let i = 1; i < excelSheetData.length; i++) {
      if (!languagesList.includes(excelSheetData[i][2])) {
        throw new BadRequestException('File contains not exists language code');
      }
    }

    // Create object with data to save
    const saveObject = [];

    // Fill out translation keys, texts and languages
    for (let i = 1; i < excelSheetData.length; i++) {
      const languageCandidate = await this.prismaService.language.findFirst({
        where: {
          code: excelSheetData[i][2],
        },
      });

      const keyCandidate = await this.prismaService.translationKey.findFirst({
        where: {
          key: excelSheetData[i][0],
        },
      });

      saveObject.push({});

      saveObject[i - 1].languageId = languageCandidate.id;
      saveObject[i - 1].text = excelSheetData[i][1];

      if (keyCandidate) {
        saveObject[i - 1].keyId = keyCandidate.id;
      } else {
        const newKey = await this.prismaService.translationKey.create({
          data: {
            key: excelSheetData[i][0],
          },
        });

        saveObject[i - 1].keyId = newKey.id;
      }
    }

    // Save or update translations

    for (let i = 0; i < saveObject.length; i++) {
      const candidate = await this.prismaService.translation.findFirst({
        where: {
          languageId: saveObject[i].languageId,
          keyId: saveObject[i].keyId,
        },
      });

      if (candidate) {
        if (candidate.text !== saveObject[i].text) {
          await this.prismaService.translation.update({
            where: {
              id: candidate.id,
            },
            data: {
              text: saveObject[i].text,
            },
          });
        }
      } else {
        await this.prismaService.translation.create({
          data: saveObject[i],
        });
      }
    }
  }
}
