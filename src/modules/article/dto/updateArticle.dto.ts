import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  IsISO8601,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ArticleDto } from './article.dto';

export class UpdateArticleRequestDto {
  @ApiPropertyOptional({
    description: 'The title of the article',
    example: 'My First Article',
    minLength: 6,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'The content of the article',
    example: 'This is the article content...',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'The publish date of the article',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601({ strictSeparator: true, strict: true })
  publishDate?: Date;

  @ApiPropertyOptional({
    description: 'The id of the author',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  authorId?: number;
}

export class UpdateArticleResponseDto extends ArticleDto {}
