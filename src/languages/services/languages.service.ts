import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class LanguagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLanguages() {
    const languages = await this.prismaService.language.findMany({});

    const translations = await this.prismaService.translation.findMany({});

    const languagesResponse = JSON.parse(JSON.stringify([...languages]));

    languagesResponse.forEach((item) => {
      item.translatedCount = 0;
    });

    for (let i = 0; i < languagesResponse.length; i++) {
      for (let j = 0; j < translations.length; j++) {
        if (translations[j].languageId === languagesResponse[i].id) {
          languagesResponse[i].translatedCount += 1;
        }
      }
    }

    return languagesResponse;
  }

  async getLanguageIcon(id: string) {
    const icon = await this.prismaService.languageIcon.findFirst({
      where: {
        id,
      },
    });

    if (!icon) {
      throw new NotFoundException('Icon not exists');
    }

    return icon.icon;
  }
}
