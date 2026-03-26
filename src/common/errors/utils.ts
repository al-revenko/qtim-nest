import { HttpException, HttpStatus } from '@nestjs/common';
import { AppException, AppErrorType } from '.';

export function mapErrorToHTTPStatus(error: unknown): number {
  if (error instanceof AppException) {
    switch (error.type) {
      case AppErrorType.CLIENT:
        return HttpStatus.BAD_REQUEST;
      case AppErrorType.VALIDATION:
        return HttpStatus.BAD_REQUEST;
      case AppErrorType.AUTHENTICATION:
        return HttpStatus.UNAUTHORIZED;
      case AppErrorType.NOT_ALLOWED:
        return HttpStatus.FORBIDDEN;
      case AppErrorType.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case AppErrorType.SERVER:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  if (error instanceof HttpException) {
    return error.getStatus();
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}
