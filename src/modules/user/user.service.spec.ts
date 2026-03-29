import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from 'src/common/errors';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    let mockUser: User;

    beforeEach(() => {
      jest.clearAllMocks();
      mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: 'password123',
        articles: [],
      };
    });

    it('should create a user and save it', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(Promise.resolve(mockUser));

      const usernameValue = 'testuser';
      const passwordValue = 'password123';

      const result = await service.create(usernameValue, passwordValue);

      expect(userRepository.create).toHaveBeenCalledWith({
        username: usernameValue,
        passwordHash: passwordValue,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
      expect(result.username).toBe(usernameValue);
      expect(result.passwordHash).toBe(passwordValue);
    });
  });

  describe('findOneByUsername()', () => {
    let mockUser: User;

    beforeEach(() => {
      jest.clearAllMocks();
      mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: 'password123',
        articles: [],
      };
    });

    it('should find a user by username when user exists', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(mockUser));

      const result = await service.findOneByUsername('testuser');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(null));

      const result = await service.findOneByUsername('nonexistentuser');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'nonexistentuser',
      });
      expect(result).toBeNull();
    });

    describe('getOne()', () => {
      let mockUser: User;

      beforeEach(() => {
        jest.clearAllMocks();
        mockUser = {
          id: 1,
          username: 'testuser',
          passwordHash: 'password123',
          articles: [],
        };
      });

      it('should return the user when found by id', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

        const result = await service.getOne(1);

        expect(service.findOne).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
      });

      it('should throw NotFoundException when user is not found', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValue(null);

        await expect(service.getOne(999)).rejects.toThrow(
          new NotFoundException('User with id 999 not found'),
        );

        expect(service.findOne).toHaveBeenCalledWith(999);
      });
    });
  });
});
