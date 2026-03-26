import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from '../orm';
import { DataSource } from 'typeorm';

config({
  quiet: true,
});

const configService = new ConfigService();

export default new DataSource(getTypeOrmConfig(configService));
