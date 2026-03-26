import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(username: string, passwordHash: string): Promise<User> {
    const user = this.userRepository.create({ username, passwordHash });
    return this.userRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      username,
    });
  }
}
