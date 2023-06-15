import { Module } from '@nestjs/common';

import { LanguagesModule } from '../languages/languages.module';
import { TranslationService } from './services/translation.service';
import { TranslationController } from './translation.controller';

@Module({
  providers: [TranslationService],
  controllers: [TranslationController],
  imports: [LanguagesModule],
  exports: [TranslationService],
})
export class TranslationModule {}
