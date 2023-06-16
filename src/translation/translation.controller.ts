import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  GetTransactionsQuery,
  GetTranslationsResponse,
  MakeTranslateDto,
  PatchTranslationDto,
  TranslationDto,
} from './dto';
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
  async createTranslation(@Body() data: MakeTranslateDto) {
    return this.translationService.createTranslation(data);
  }

  @ApiOperation({
    description: 'Get translations',
  })
  @ApiOkResponse({
    description: 'Translations received successfully',
    type: GetTranslationsResponse,
    isArray: true,
  })
  @Get()
  async getTranslations(
    @Query() query: GetTransactionsQuery, // : Promise<GetTranslationsResponse[]>
  ) {
    return this.translationService.getTranslations(query);
  }

  @ApiOperation({
    description: 'Update translation',
  })
  @ApiOkResponse({
    description: 'Translation updated successfully',
    type: TranslationDto,
  })
  @ApiBadRequestResponse({
    description: 'Translation not exists',
  })
  @ApiParam({
    name: 'id',
    description: 'Translation `id`',
  })
  @Patch(':id')
  async patchTranslation(
    @Param('id') id: string,
    @Body() data: PatchTranslationDto,
  ) {
    return this.translationService.patchTranslation(id, data);
  }
}
