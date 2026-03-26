import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import path from 'node:path/win32';

export function getTypeOrmConfig(
  configService: ConfigService,
): DataSourceOptions {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    migrations: [path.join(__dirname, 'migrations/**/*.js')],
    synchronize: false,
    migrationsRun: false,
  };
}
