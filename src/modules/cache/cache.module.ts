import { createClient, createKeyv } from '@keyv/redis';
import { DynamicModule, Inject, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

const CACHE_CLIENT_PROVIDER = 'CACHE_CLIENT_PROVIDER';

@Module({})
export class CacheModule {
  static register(namespace: string): DynamicModule {
    const nestCacheModule = NestCacheModule.registerAsync({
      imports: [CacheClientModule],
      inject: [ConfigService, CACHE_CLIENT_PROVIDER],
      useFactory: (configService: ConfigService, redisClient: any) => {
        return {
          stores: [
            createKeyv(redisClient, {
              namespace,
            }),
          ],
          ttl: configService.get<number>('CACHE_TTL_MS'),
        };
      },
    });

    return {
      module: CacheModule,
      imports: [nestCacheModule],
      exports: [CacheService, nestCacheModule],
      providers: [CacheService],
    };
  }
}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CACHE_CLIENT_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return createClient({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
          database: configService.get<number>('CACHE_REDIS_DB'),
        });
      },
    },
  ],
  exports: [CACHE_CLIENT_PROVIDER, ConfigModule],
})
class CacheClientModule {}
