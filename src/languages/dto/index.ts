import { ApiProperty } from '@nestjs/swagger';
import { Language } from '@prisma/client';

export class GetLanguagesResponse implements Language {
  @ApiProperty({
    description: 'Language ID',
    type: String,
    example: '5d556e76-54ae-45eb-98cb-c062f68fbee4',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Language code',
    type: String,
    example: 'en',
  })
  readonly code: string;

  @ApiProperty({
    description: 'Language icon ID',
    type: String,
    example: '627ef959-d2e6-4071-8d67-883f2b6cb6ed',
  })
  readonly iconId: string;

  @ApiProperty({
    description: 'Number of translated phrases',
    type: Number,
    example: 10,
    default: 0,
  })
  readonly translatedCount: number;

  @ApiProperty({
    description: 'Time when was created',
    type: String,
    example: '2023-06-15 18:13:08.628',
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Time when was updated',
    type: String,
    example: '2023-06-15 18:13:08.628',
  })
  readonly updatedAt: Date;
}
