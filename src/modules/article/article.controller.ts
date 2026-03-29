import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Query,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { AppErrorResponse, AppResponse } from 'src/common/api/decorators';
import {
  CreateArticleRequestDto,
  CreateArticleResponseDto,
  DeleteArticleResponseDto,
  GetAllArticlesQueryDto,
  GetAllArticlesResponseDto,
  GetArticleResponseDto,
  UpdateArticleRequestDto,
} from './dto';
import { AuthGuard } from '../auth/gurards';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new article' })
  @AppResponse(HttpStatus.CREATED, { type: CreateArticleResponseDto })
  @AppErrorResponse([
    HttpStatus.BAD_REQUEST,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  async create(
    @Body(new ValidationPipe()) createArticleDto: CreateArticleRequestDto,
  ): Promise<CreateArticleResponseDto> {
    const article = await this.articleService.create(
      createArticleDto.authorId,
      createArticleDto.title,
      createArticleDto.content,
    );

    return article;
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles use filters' })
  @AppResponse(HttpStatus.OK, { type: GetAllArticlesResponseDto })
  @AppErrorResponse([HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST])
  async getAll(
    @Query() query: GetAllArticlesQueryDto,
  ): Promise<GetAllArticlesResponseDto> {
    const { items, totalCount, pageCount, page } =
      await this.articleService.findAll({
        take: query.limit,
        page: query.page,
        order: query.order,
        filterBy: {
          title: query.title,
          authorId: query.authorId,
          publishDate: {
            start: query.publishDateStart,
            end: query.publishDateEnd,
          },
        },
      });

    return {
      items,
      page,
      totalCount,
      pageCount,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by ID' })
  @AppResponse(HttpStatus.OK, { type: GetArticleResponseDto })
  @AppErrorResponse([HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST])
  async getOne(
    @Param('id', new ParseIntPipe())
    id: number,
  ): Promise<GetArticleResponseDto> {
    const article = await this.articleService.getOne(id, ['author']);

    return article;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an article by ID' })
  @AppResponse(HttpStatus.OK, { type: CreateArticleResponseDto })
  @AppErrorResponse([
    HttpStatus.BAD_REQUEST,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateArticleDto: UpdateArticleRequestDto,
  ): Promise<CreateArticleResponseDto> {
    const article = await this.articleService.update(id, updateArticleDto);

    return article;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an article by ID' })
  @AppResponse(HttpStatus.OK, { type: DeleteArticleResponseDto })
  @AppErrorResponse([HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST])
  async delete(
    @Param('id', new ParseIntPipe())
    id: number,
  ): Promise<DeleteArticleResponseDto> {
    const article = await this.articleService.delete(id);

    return article;
  }
}
