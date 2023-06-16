import { BadRequestException, Injectable } from '@nestjs/common';
import { TranslationKey } from '@prisma/client';

import { PrismaService } from '../../shared/prisma/prisma.service';
import { GetTransactionsQuery, TranslateDto } from '../dto';

@Injectable()
export class TranslationService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTranslation(data: TranslateDto) {
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
    return this.prismaService.translationKey.findMany({
      include: {
        translations: true,
      },
    });
  }
}
