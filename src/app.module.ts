import { Module } from '@nestjs/common';

import { LanguagesController } from './languages/languages.controller';
import { LanguagesModule } from './languages/languages.module';
import { LanguagesService } from './languages/services/languages.service';

@Module({
  imports: [LanguagesModule],
  controllers: [LanguagesController],
  providers: [LanguagesService],
})
export class AppModule {}
