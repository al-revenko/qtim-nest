import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { UserService } from '../user/user.service';
import { throwDbAsAppException } from 'src/common/errors/utils';
import { User } from '../user/user.entity';
import { ValidationException } from 'src/common/errors';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

interface ArticleFieldFilter {
  title?: string;
  authorId?: number;
  publishDate?: {
    start?: Date;
    end?: Date;
  };
}

export interface FindAllArticlesOptions {
  take?: number;
  page?: number;
  order?: Order;
  filterBy?: ArticleFieldFilter;
}

export interface UpdateArticleFields {
  title?: string;
  content?: string;
  publishDate?: Date;
  authorId?: number;
}

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private userService: UserService,
  ) {}

  async create(
    authorId: number,
    title: string,
    content: string,
  ): Promise<Article> {
    const author = await this.userService.getOne(authorId);

    const article = this.articleRepository.create({
      title,
      content,
      publishDate: new Date(),
      author,
    });

    return this.articleRepository
      .save(article)
      .catch((e) =>
        throwDbAsAppException(e, { entity: Article, relatedEntity: User }),
      );
  }

  async findOne(id: number, relations: string[] = []): Promise<Article | null> {
    return this.articleRepository
      .findOne({ where: { id }, relations })
      .catch((e) =>
        throwDbAsAppException(e, { entity: Article, relatedEntity: User }),
      );
  }

  async getOne(id: number, relations: string[] = []): Promise<Article> {
    const article = await this.findOne(id, relations);
    if (!article) {
      throw new NotFoundException(`Article with id: ${id} not found`);
    }

    return article;
  }

  async findAll(opt: FindAllArticlesOptions = {}) {
    const { take, page = 1, order = Order.DESC, filterBy } = opt;

    if (take === 0) {
      return {
        items: [],
        page,
        totalCount: await this.articleRepository.count(),
        pageCount: 0,
      };
    }

    const skip = (page - 1) * (take ?? 0);

    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .skip(skip)
      .take(take)
      .orderBy('article.publishDate', order);

    if (filterBy) {
      if (filterBy.title !== undefined) {
        query.andWhere('article.title = :title', {
          title: filterBy.title,
        });
      }

      if (filterBy.authorId !== undefined) {
        query.andWhere('author.id = :authorId', {
          authorId: filterBy.authorId,
        });
      }

      if (filterBy.publishDate) {
        if (filterBy.publishDate.start) {
          query.andWhere('article.publishDate >= :start', {
            start: filterBy.publishDate.start,
          });
        }

        if (filterBy.publishDate.end) {
          query.andWhere('article.publishDate <= :end', {
            end: filterBy.publishDate.end,
          });
        }
      }
    }

    const [items, totalCount] = await query
      .getManyAndCount()
      .catch((e) =>
        throwDbAsAppException(e, { entity: Article, relatedEntity: User }),
      );

    const pageCount = Math.ceil(totalCount / (take ?? 1));

    return {
      items,
      page,
      totalCount,
      pageCount,
    };
  }

  async update(id: number, fields: UpdateArticleFields): Promise<Article> {
    if (!Object.keys(fields).length) {
      throw new ValidationException('No fields to update');
    }

    const existingArticle = await this.getOne(id);

    if (fields.authorId) {
      existingArticle.author = await this.userService.getOne(fields.authorId);
    }

    if (fields.title) {
      existingArticle.title = fields.title;
    }

    if (fields.content) {
      existingArticle.content = fields.content;
    }

    if (fields.publishDate) {
      existingArticle.publishDate = fields.publishDate;
    }

    return await this.articleRepository
      .save(existingArticle)
      .catch((e) =>
        throwDbAsAppException(e, { entity: Article, relatedEntity: User }),
      );
  }

  async delete(id: number): Promise<Article> {
    const article = await this.getOne(id);

    return this.articleRepository
      .remove(article)
      .catch((e) =>
        throwDbAsAppException(e, { entity: Article, relatedEntity: User }),
      );
  }
}
