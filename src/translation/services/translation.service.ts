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
}
