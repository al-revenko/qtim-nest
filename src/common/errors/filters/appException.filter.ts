import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { getStatusCodeErrorStr, responseErrorJSON } from 'src/common/api/utils';
import { AppException, AppExceptionType } from '..';
import { errorToHTTPStatus } from '../utils';

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost) {
    const logger = new Logger(AppExceptionFilter.name);

    let statusCode: HttpStatus = errorToHTTPStatus(exception);
    let message = exception.message;

    if (statusCode >= 500 || exception.type === AppExceptionType.SERVER) {
      message = getStatusCodeErrorStr(statusCode);

      logger.error(exception, exception.cause);
    }

    const ctx = host.switchToHttp();
    responseErrorJSON(ctx, statusCode, message);
  }
}
