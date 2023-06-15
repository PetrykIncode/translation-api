import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GetTransactionsQuery, TranslateDto, TranslationDto } from './dto';
import { TranslationService } from './services/translation.service';

@ApiTags('Translations')
@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @ApiOperation({
    description:
      "Create translation. <br><br>The first translation should be with `code: 'en'`",
  })
  @ApiOkResponse({
    description: 'Translation created successfully',
    type: TranslationDto,
  })
  @ApiBadRequestResponse({
    description: '`key` and `text` should be unique',
  })
  @Post()
  async createTranslation(@Body() data: TranslateDto) {
    return this.translationService.createTranslation(data);
  }

  @ApiOperation({
    description: 'Get translations',
  })
  @ApiOkResponse({
    description: 'Translations received successfully',
    type: TranslationDto,
    isArray: true,
  })
  @Get()
  async getTranslations(@Query() query: GetTransactionsQuery) {
    return this.translationService.getTranslations(query);
  }
}
