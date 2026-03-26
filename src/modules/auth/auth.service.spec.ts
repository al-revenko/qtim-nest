import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import {
  AuthenticationException,
  ValidationException,
} from 'src/common/errors';

jest.mock('../user/user.service');
jest.mock('@nestjs/jwt');
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue(10),
  hash: jest.fn(async (password: string) => {
    return `hashed${password}`;
  }),
  compare: jest.fn(async (password: string, hash: string) => {
    return `hashed${password}` === hash;
  }),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userServiceMock: jest.Mocked<UserService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userServiceMock = module.get<jest.Mocked<UserService>>(UserService);
    jwtServiceMock = module.get<jest.Mocked<JwtService>>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp()', () => {
    let mockUser: User;

    beforeEach(() => {
      jest.clearAllMocks();
      mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: 'hashedpassword123',
      };
    });

    it('should return access_token and user when username is available', async () => {
      userServiceMock.findOneByUsername.mockResolvedValue(null);
      userServiceMock.create.mockResolvedValue(mockUser);
      jwtServiceMock.signAsync.mockResolvedValue('mock-jwt-token');

      const result = await authService.signUp('testuser', 'password123');

      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(
        'testuser',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userServiceMock.create).toHaveBeenCalledWith(
        'testuser',
        mockUser.passwordHash,
      );
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: mockUser,
      });
    });

    it('should throw ValidationException when username already exists', async () => {
      userServiceMock.findOneByUsername.mockResolvedValue(mockUser);

      await expect(
        authService.signUp('testuser', 'password123'),
      ).rejects.toThrow(ValidationException);
      await expect(
        authService.signUp('testuser', 'password123'),
      ).rejects.toThrow('Username already exists');

      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(
        'testuser',
      );

      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userServiceMock.create).not.toHaveBeenCalled();
    });
  });

  describe('signIn()', () => {
    let mockUser: User;

    beforeEach(() => {
      jest.clearAllMocks();
      mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: 'hashedpassword123',
      };
    });

    it('should return access_token when credentials are valid', async () => {
      userServiceMock.findOneByUsername.mockResolvedValue(mockUser);
      jwtServiceMock.signAsync.mockResolvedValue('mock-jwt-token');

      const result = await authService.signIn('testuser', 'password123');

      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(
        'testuser',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.passwordHash,
      );
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
      });
    });

    it('should throw AuthenticationException when user not found', async () => {
      userServiceMock.findOneByUsername.mockResolvedValue(null);

      await expect(
        authService.signIn('nonexistent', 'password123'),
      ).rejects.toThrow(AuthenticationException);
      await expect(
        authService.signIn('nonexistent', 'password123'),
      ).rejects.toThrow('Invalid credentials');

      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(
        'nonexistent',
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw AuthenticationException when password is invalid', async () => {
      userServiceMock.findOneByUsername.mockResolvedValue(mockUser);

      await expect(
        authService.signIn('testuser', 'wrongpassword'),
      ).rejects.toThrow(AuthenticationException);
      await expect(
        authService.signIn('testuser', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');

      expect(userServiceMock.findOneByUsername).toHaveBeenCalledWith(
        'testuser',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedpassword123',
      );
      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('getAccessToken()', () => {
    let mockUser: User;

    beforeEach(() => {
      jest.clearAllMocks();
      mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: 'hashedpassword123',
      };
    });

    it('should return a valid JWT string with correct payload', async () => {
      jwtServiceMock.signAsync.mockResolvedValue('jwt-token-123');

      const result = await authService.getAccessToken(mockUser);

      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
      expect(result).toBe('jwt-token-123');
    });
  });
});
