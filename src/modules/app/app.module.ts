import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from 'src/common/db/orm';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from '../auth/auth.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppExceptionFilter } from 'src/common/errors/filters';
import { ArticleModule } from 'src/modules/article/article.module';

const AppModules = [UserModule, AuthModule, ArticleModule];

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...getTypeOrmConfig(configService),
        autoLoadEntities: true,
      }),
    }),
    ...AppModules,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: false,
          transformOptions: {
            exposeUnsetFields: false,
          },
        });
      },
    },
  ],
  controllers: [],
})
export class AppModule {}
