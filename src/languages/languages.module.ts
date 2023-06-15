import { Module } from '@nestjs/common';

import { LanguagesController } from './languages.controller';
import { LanguagesService } from './services/languages.service';

@Module({
  providers: [LanguagesService],
  controllers: [LanguagesController],
  imports: [],
  exports: [LanguagesService],
})
export class LanguagesModule {}
