import { Test, TestingModule } from '@nestjs/testing';
import {
  ArticleService,
  Order,
  FindAllArticlesOptions,
} from './article.service';
import { Article } from './article.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { NotFoundException, ValidationException } from 'src/common/errors';
import { QueryFailedError } from 'typeorm';

jest.mock('../user/user.service');

const createMockUser = (): User => {
  return {
    id: 1,
    username: 'testuser',
    passwordHash: 'hashedpassword123',
    articles: [],
  };
};

const createMockArticle = (): Article => {
  return {
    id: 1,
    title: 'Test Article',
    content: 'This is a test article',
    publishDate: new Date('2024-01-15'),
    author: {
      id: 1,
      username: 'testuser',
      passwordHash: 'hashedpassword123',
      articles: [],
    },
  };
};

describe('ArticleService', () => {
  let articleService: ArticleService;
  let articleRepository: Repository<Article>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        UserService,
        {
          provide: getRepositoryToken(Article),
          useClass: Repository,
        },
      ],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<Repository<Article>>(
      getRepositoryToken(Article),
    );
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    const title = 'New Article';
    const content = 'Article content here';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create an article and save it', async () => {
      const mockUser = createMockUser();
      const mockArticle = createMockArticle();

      mockArticle.title = title;
      mockArticle.content = content;

      jest.spyOn(userService, 'getOne').mockResolvedValue(mockUser);
      jest.spyOn(articleRepository, 'create').mockReturnValue(mockArticle);
      jest.spyOn(articleRepository, 'save').mockResolvedValue(mockArticle);

      const result = await articleService.create(mockUser.id, title, content);

      expect(userService.getOne).toHaveBeenCalledWith(1);
      expect(articleRepository.create).toHaveBeenCalledWith({
        title,
        content,
        publishDate: expect.any(Date),
        author: mockUser,
      });
      expect(articleRepository.save).toHaveBeenCalledWith(mockArticle);
      expect(result).toEqual(mockArticle);
      expect(result.title).toBe(title);
      expect(result.content).toBe(content);
    });
  });

  describe('findOne()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should find an article by id with optional relations', async () => {
      const mockUser = createMockUser();
      const mockArticle = createMockArticle();

      mockArticle.author = mockUser;

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(mockArticle);

      const result = await articleService.findOne(mockArticle.id, ['author']);

      expect(articleRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockArticle.id },
        relations: ['author'],
      });
      expect(result).toEqual(mockArticle);
    });

    it('should return null when article is not found', async () => {
      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(null);

      const result = await articleService.findOne(999);

      expect(result).toBeNull();
    });

    it('should throw an exception on repository error', async () => {
      jest
        .spyOn(articleRepository, 'findOne')
        .mockRejectedValue(new Error('test'));

      await expect(articleService.findOne(999)).rejects.toThrow();
    });
  });

  describe('getOne()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the article when found by id', async () => {
      const mockUser = createMockUser();
      const mockArticle = createMockArticle();

      mockArticle.author = mockUser;

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(mockArticle);

      const result = await articleService.getOne(mockArticle.id);

      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when article is not found', async () => {
      jest.spyOn(articleService, 'findOne').mockResolvedValue(null);

      await expect(articleService.getOne(999)).rejects.toThrow(
        new NotFoundException('Article with id: 999 not found'),
      );

      expect(articleService.findOne).toHaveBeenCalledWith(999, []);
    });
  });

  describe('findAll()', () => {
    let mockQueryBuilder: any;

    beforeEach(() => {
      jest.clearAllMocks();
      mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      };
    });

    it('should return empty items when take is 0', async () => {
      jest.spyOn(articleRepository, 'count').mockResolvedValue(10);

      const result = await articleService.findAll({ take: 0, page: 1 });

      expect(result).toEqual({
        items: [],
        page: 1,
        totalCount: 10,
        pageCount: 0,
      });
      expect(articleRepository.count).toHaveBeenCalled();
    });

    it('should return paginated articles with default options', async () => {
      const mockArticle = createMockArticle();

      const mockData: [Article[], number] = [[mockArticle], 1];

      jest
        .spyOn(articleRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);
      jest
        .spyOn(mockQueryBuilder, 'getManyAndCount')
        .mockResolvedValue(mockData);

      const result = await articleService.findAll();

      expect(articleRepository.createQueryBuilder).toHaveBeenCalledWith(
        'article',
      );
      expect(result).toEqual({
        items: [mockArticle],
        page: 1,
        totalCount: 1,
        pageCount: 1,
      });
    });

    it('should apply title filter when provided', async () => {
      const mockArticle = createMockArticle();
      const mockData: [Article[], number] = [[mockArticle], 10];

      jest
        .spyOn(articleRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);
      jest
        .spyOn(mockQueryBuilder, 'getManyAndCount')
        .mockResolvedValue(mockData);

      const options: FindAllArticlesOptions = {
        take: 10,
        page: 1,
        filterBy: { title: 'Test' },
      };

      await articleService.findAll(options);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'article.title = :title',
        { title: 'Test' },
      );
    });

    it('should apply authorId filter when provided', async () => {
      const mockArticle = createMockArticle();
      const mockData: [Article[], number] = [[mockArticle], 10];

      jest
        .spyOn(articleRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);
      jest
        .spyOn(mockQueryBuilder, 'getManyAndCount')
        .mockResolvedValue(mockData);

      const options: FindAllArticlesOptions = {
        take: 10,
        page: 1,
        filterBy: { authorId: 2 },
      };

      await articleService.findAll(options);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'author.id = :authorId',
        { authorId: 2 },
      );
    });

    it('should apply publishDate start filter when provided', async () => {
      const mockArticle = createMockArticle();
      const mockData: [Article[], number] = [[mockArticle], 10];
      jest
        .spyOn(articleRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);
      jest
        .spyOn(mockQueryBuilder, 'getManyAndCount')
        .mockResolvedValue(mockData);

      const options: FindAllArticlesOptions = {
        take: 10,
        page: 1,
        filterBy: { publishDate: { start: new Date('2024-01-01') } },
      };

      await articleService.findAll(options);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'article.publishDate >= :start',
        { start: new Date('2024-01-01') },
      );
    });

    it('should apply publishDate end filter when provided', async () => {
      const mockArticle = createMockArticle();
      const mockData: [Article[], number] = [[mockArticle], 10];

      jest
        .spyOn(articleRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);
      jest
        .spyOn(mockQueryBuilder, 'getManyAndCount')
        .mockResolvedValue(mockData);

      const options: FindAllArticlesOptions = {
        take: 10,
        page: 1,
        filterBy: { publishDate: { end: new Date('2024-12-31') } },
      };

      await articleService.findAll(options);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'article.publishDate <= :end',
        { end: new Date('2024-12-31') },
      );
    });

    it('should apply ASC order when specified', async () => {
      const mockArticle = createMockArticle();
      const mockData: [Article[], number] = [[mockArticle], 10];

      jest
        .spyOn(articleRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);
      jest
        .spyOn(mockQueryBuilder, 'getManyAndCount')
        .mockResolvedValue(mockData);

      const options: FindAllArticlesOptions = {
        take: 10,
        page: 1,
        order: Order.ASC,
      };

      await articleService.findAll(options);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'article.publishDate',
        'ASC',
      );
    });
  });

  describe('update()', () => {
    let mockArticle: Article;
    let mockUser: User;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update an article with provided fields', async () => {
      const mockArticle = createMockArticle();

      jest.spyOn(articleService, 'getOne').mockResolvedValue(mockArticle);
      jest
        .spyOn(articleRepository, 'save')
        .mockImplementation((v: Article) => Promise.resolve(v));

      const updatedTitle = 'Updated Title';
      const result = await articleService.update(1, { title: updatedTitle });

      expect(articleService.getOne).toHaveBeenCalledWith(1);
      expect(articleRepository.save).toHaveBeenCalledTimes(1);
      expect(result.title).toBe(updatedTitle);
    });

    it('should update authorId when provided', async () => {
      const mockArticle = createMockArticle();
      const mockUser = createMockUser();

      mockUser.id = 2;

      jest.spyOn(articleService, 'getOne').mockResolvedValue(mockArticle);
      jest.spyOn(userService, 'getOne').mockResolvedValue(mockUser);
      jest.spyOn(articleRepository, 'save').mockResolvedValue(mockArticle);

      const result = await articleService.update(1, { authorId: 2 });

      expect(articleService.getOne).toHaveBeenCalledWith(1);
      expect(userService.getOne).toHaveBeenCalledWith(2);
      expect(articleRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...mockArticle,
        author: mockUser,
      });
    });

    it('should throw ValidationException when no fields provided', async () => {
      await expect(articleService.update(1, {})).rejects.toThrow(
        ValidationException,
      );
    });

    it('should update title, content, and publishDate when all provided', async () => {
      const mockArticle = createMockArticle();

      jest.spyOn(articleService, 'getOne').mockResolvedValue(mockArticle);
      jest.spyOn(articleRepository, 'save').mockResolvedValue(mockArticle);

      const result = await articleService.update(1, {
        title: 'New Title',
        content: 'New content',
        publishDate: new Date('2024-02-01'),
      });

      const newArticleMock: Article = {
        ...mockArticle,
        title: 'New Title',
        content: 'New content',
        publishDate: new Date('2024-02-01'),
      };

      expect(result).toEqual(newArticleMock);
    });
  });

  describe('delete()', () => {
    let mockArticle: Article;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete an article and return it', async () => {
      const mockArticle = createMockArticle();

      jest.spyOn(articleService, 'getOne').mockResolvedValue(mockArticle);
      jest.spyOn(articleRepository, 'remove').mockResolvedValue(mockArticle);

      const result = await articleService.delete(1);

      expect(articleService.getOne).toHaveBeenCalledWith(1);
      expect(articleRepository.remove).toHaveBeenCalledWith(mockArticle);
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when article is not found', async () => {
      const err = new NotFoundException('Article with id: 999 not found');

      jest.spyOn(articleService, 'getOne').mockRejectedValue(err);

      await expect(articleService.delete(999)).rejects.toThrow(err);
    });
  });
});
