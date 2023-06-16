import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import {
  GetTransactionsQuery,
  GetTranslationsResponse,
  ImportTranslationsDto,
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

  @ApiOperation({
    description: 'Export translations into Excel file',
  })
  @ApiOkResponse({
    description: 'File exported successfully',
  })
  @Get('export')
  async exportTable(@Res() res: Response) {
    const buffer = await this.translationService.exportTable();

    res.set({
      'Content-Disposition': 'attachment; filename="excel_file.xlsx"',
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    res.send(buffer);
  }

  @ApiOperation({
    description: 'Import translations from Excel file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'File uploaded successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async importTable(
    @Body() data: ImportTranslationsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.translationService.importTranslations(file.buffer);
  }
}
