import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { LanguagesService } from './services/languages.service';

@ApiTags('Languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @ApiOperation({
    description: 'Get languages list',
  })
  @ApiOkResponse({
    description: 'Languages received successfully',
  })
  @Get()
  async getLanguagesList() {
    return this.languagesService.getLanguages();
  }

  @ApiOperation({
    description: 'Get language icon',
  })
  @ApiOkResponse({
    description: 'Icon received successfully',
  })
  @ApiNotFoundResponse({
    description: 'Icon not exists',
  })
  @ApiParam({
    name: 'id',
    description: '`iconId` field from get languages response',
  })
  @Get('icon/:id')
  async getLanguageIcon(@Param('id') id: string, @Res() res: Response) {
    const icon = await this.languagesService.getLanguageIcon(id);

    res.set('Content-Type', 'image/png');
    res.set('Content-Length', icon.length.toString());

    res.send(icon);
  }

  @ApiExcludeEndpoint()
  @Post()
  async addLanguage() {
    // TODO it later
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  async updateLanguage() {
    // TODO it later
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  async deleteLanguage() {
    // TODO it later
  }
}
