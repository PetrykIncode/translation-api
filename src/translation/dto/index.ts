import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class TranslateDto {
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
