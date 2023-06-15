import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class LanguagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLanguages() {
    return this.prismaService.language.findMany({});
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
