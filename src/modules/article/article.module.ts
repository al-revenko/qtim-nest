import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { UserModule } from '../user/user.module';
import { ArticleController } from './article.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UserModule, AuthModule],
  providers: [ArticleService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
