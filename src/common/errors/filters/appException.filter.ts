import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { getStatusCodeMessage, responseErrorJSON } from 'src/common/api/utils';
import { mapErrorToHTTPStatus } from '../utils';
import { AppException } from '..';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const logger = new Logger(AppExceptionFilter.name);

    const statusCode = mapErrorToHTTPStatus(exception);
    let message = getStatusCodeMessage(statusCode) ?? 'API error';

    if (exception instanceof AppException && statusCode < 500) {
      message = exception.message;
    }

    if (statusCode >= 500) {
      if (exception instanceof Error) {
        logger.error(exception.message, exception.stack);
      } else {
        logger.error(exception);
      }
    }

    const ctx = host.switchToHttp();
    responseErrorJSON(ctx, statusCode, message);
  }
}
