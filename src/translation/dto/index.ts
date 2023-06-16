import { ApiProperty } from '@nestjs/swagger';
import { Translation, TranslationKey } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class TranslationDto implements Translation {
  @ApiProperty({
    description: 'Translation ID',
    type: String,
    example: '4256b661-cd62-41ae-b808-04274127a173',
  })
  id: string;

  @ApiProperty({
    description: 'Translation key ID',
    type: String,
    example: '2ad81e6a-a840-4679-9cd2-b99ef12a5edf',
  })
  keyId: string;

  @ApiProperty({
    description: 'Language ID',
    type: String,
    example: '17c94626-f735-4c65-a126-035cd747efa9',
  })
  languageId: string;

  @ApiProperty({
    description: 'Translated text',
    type: String,
    example: 'Login',
  })
  text: string;

  @ApiProperty({
    description: 'Time when was created',
    type: String,
    example: '2023-06-15 18:13:08.628',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Time when was updated',
    type: String,
    example: '2023-06-15 18:13:08.628',
  })
  updatedAt: Date;
}

export class TranslationKeyDto implements TranslationKey {
  @ApiProperty({
    description: 'Translation ID',
    type: String,
    example: '2ad81e6a-a840-4679-9cd2-b99ef12a5edf',
  })
  id: string;

  @ApiProperty({
    description: 'Translation key',
    type: String,
    example: 'login.title',
  })
  key: string;

  @ApiProperty({
    description: 'Time when was created',
    type: String,
    example: '2023-06-15 18:33:03.027',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Time when was updated',
    type: String,
    example: '2023-06-15 18:33:03.027',
  })
  updatedAt: Date;
}

export class MakeTranslateDto {
  @ApiProperty({
    description: 'Translation key to translate',
    type: String,
    example: 'login.title',
    uniqueItems: true,
  })
  @IsString()
  readonly key: string;

  @ApiProperty({
    description: 'Language code to translate for',
    type: String,
    example: 'ua',
    uniqueItems: true,
  })
  @IsString()
  readonly code: string;

  @ApiProperty({
    description: 'Translated text',
    type: String,
    example: 'Увійти',
    uniqueItems: true,
  })
  @IsString()
  readonly text: string;
}

export class GetTransactionsQuery {
  @ApiProperty({
    description: 'Page number',
    type: Number,
    default: 1,
    required: false,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  readonly page?: number;

  @ApiProperty({
    description: 'Page limit',
    type: Number,
    default: 100,
    required: false,
    example: 50,
  })
  @Type(() => Number)
  @IsOptional()
  readonly limit?: number;
}

export class GetTranslationsResponse extends TranslationKeyDto {
  @ApiProperty({
    description: 'Translations list',
    type: TranslationDto,
    isArray: true,
  })
  translations: TranslationDto[];
}

export class PatchTranslationDto implements Pick<Translation, 'text'> {
  @ApiProperty({
    description: 'Translation text to update',
    type: String,
    example: 'Login',
  })
  @IsString()
  readonly text: string;
}
