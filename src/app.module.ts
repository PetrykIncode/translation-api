import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { LanguagesController } from './languages/languages.controller';
import { LanguagesModule } from './languages/languages.module';
import { LanguagesService } from './languages/services/languages.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [
    MulterModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env'],
    }),
    PrismaModule,
    LanguagesModule,
    TranslationModule,
  ],
  controllers: [LanguagesController],
  providers: [LanguagesService],
})
export class AppModule {}
