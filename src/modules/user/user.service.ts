import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException } from 'src/common/errors';
import { throwDbAsAppException } from 'src/common/errors/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(username: string, passwordHash: string): Promise<User> {
    const user = this.userRepository.create({ username, passwordHash });

    return this.userRepository
      .save(user)
      .catch((e) => throwDbAsAppException(e, { entity: User }));
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository
      .findOneBy({
        username,
      })
      .catch((e) => throwDbAsAppException(e, { entity: User }));
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository
      .findOneBy({
        id,
      })
      .catch((e) => throwDbAsAppException(e, { entity: User }));
  }

  async getOne(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }
}
