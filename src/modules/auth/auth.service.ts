import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import {
  ValidationException,
  AuthenticationException,
} from 'src/common/errors';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, password: string) {
    const existingUser = await this.userService.findOneByUsername(username);
    if (existingUser) {
      throw new ValidationException('Username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.userService.create(username, passwordHash);

    return {
      access_token: await this.getAccessToken(user),
      user,
    };
  }

  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new AuthenticationException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationException('Invalid credentials');
    }

    return {
      access_token: await this.getAccessToken(user),
    };
  }

  async getAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return this.jwtService.signAsync(payload);
  }
}
