import { Module } from '@nestjs/common';

import { TranslationService } from './services/translation.service';
import { TranslationController } from './translation.controller';

@Module({
  providers: [TranslationService],
  controllers: [TranslationController],
})
export class TranslationModule {}
