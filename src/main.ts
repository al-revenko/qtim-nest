import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, Logger } from '@nestjs/common';
import { buildErrorResponseSchema } from './common/api/utils';
import { ErrorResponseDto } from './common/api/dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('qtim-nest')
    .setDescription('Test project for QTIM')
    .setVersion('0.0.1')
    .addGlobalResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
      schema: buildErrorResponseSchema(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
      ),
    })
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      extraModels: [ErrorResponseDto],
    });
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(
    process.env.APP_PORT ?? 3000,
    process.env.APP_HOST ?? 'localhost',
    () => {
      logger.log(
        `Server running at http://${process.env.APP_HOST ?? 'localhost'}:${process.env.APP_PORT ?? 3000}`,
      );
    },
  );
}
bootstrap();
