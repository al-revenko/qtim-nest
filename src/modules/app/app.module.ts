import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from 'src/common/db/orm';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from '../auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from 'src/common/errors/filters';

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
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
  controllers: [],
})
export class AppModule {}
