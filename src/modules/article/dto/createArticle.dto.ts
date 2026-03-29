import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { ArticleDto } from './article.dto';

export class CreateArticleRequestDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'My First Article',
    minLength: 6,
    maxLength: 255,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'This is the article content...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The id of the author',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}

export class CreateArticleResponseDto extends ArticleDto {}
