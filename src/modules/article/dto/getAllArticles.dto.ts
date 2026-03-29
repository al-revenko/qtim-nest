import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ArticleDto } from './article.dto';
import { Order } from '../article.service';

export class GetAllArticlesQueryDto {
  @ApiPropertyOptional({
    description: 'The current page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Expose()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'The number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Expose()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    required: false,
    enum: Order,
  })
  @IsOptional()
  @IsEnum(Order)
  @Expose()
  order?: Order;

  @ApiPropertyOptional({
    description: 'Filter by title',
    example: 'My Article',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Expose()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by author id (userId)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Expose()
  authorId?: number;

  @ApiPropertyOptional({
    description: 'Filter publish date start (ISO 8601)',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601({ strictSeparator: true, strict: true })
  @Expose()
  publishDateStart?: Date;

  @ApiPropertyOptional({
    description: 'Filter publish date end (ISO 8601)',
    example: '2023-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601({ strictSeparator: true, strict: true })
  @Expose()
  publishDateEnd?: Date;
}

export class GetAllArticlesResponseDto {
  @ApiProperty({
    description: 'The list of articles',
    type: [ArticleDto],
  })
  @IsArray()
  @Type(() => ArticleDto)
  @Expose()
  items: ArticleDto[];

  @ApiProperty({
    description: 'The current page number',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Expose()
  page: number;

  @ApiProperty({
    description: 'The total number of articles',
    example: 100,
  })
  @IsInt()
  @IsNotEmpty()
  @Expose()
  totalCount: number;

  @ApiProperty({
    description: 'The total number of pages',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  @Expose()
  pageCount: number;
}
