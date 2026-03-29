import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  IsDate,
} from 'class-validator';
import { AuthorDto } from './author.dto';
import { Expose, Type } from 'class-transformer';

export class ArticleDto {
  @ApiProperty({
    description: 'The article ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The title of the article',
    example: 'My First Article',
    minLength: 6,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @Expose()
  title: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'This is the article content...',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  content: string;

  @ApiProperty({
    description: 'The publish date of the article',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  @Expose()
  publishDate: Date;

  @ApiProperty({
    description: 'The author of the article',
    type: AuthorDto,
  })
  @IsNotEmpty()
  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto;
}
