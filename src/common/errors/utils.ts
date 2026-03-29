import { HttpException, HttpStatus } from '@nestjs/common';
import {
  AppException,
  AppExceptionType,
  NotFoundException,
  ServerException,
  ValidationException,
} from '.';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export function errorToHTTPStatus(error: unknown): number {
  if (error instanceof AppException) {
    switch (error.type) {
      case AppExceptionType.VALIDATION:
        return HttpStatus.BAD_REQUEST;
      case AppExceptionType.AUTHENTICATION:
        return HttpStatus.UNAUTHORIZED;
      case AppExceptionType.NOT_ALLOWED:
        return HttpStatus.FORBIDDEN;
      case AppExceptionType.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case AppExceptionType.SERVER:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  if (error instanceof HttpException) {
    return error.getStatus();
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}

export interface dbCtx {
  entity?: string | { name: string };
  relatedEntity?: string | { name: string };
}

export function dbToAppException(
  error: unknown,
  ctx: dbCtx = {},
): AppException {
  const { entity = 'Entity', relatedEntity = 'Related Entity' } = ctx;

  const entityName = typeof entity === 'string' ? entity : entity.name;
  const relatedEntityName =
    typeof relatedEntity === 'string' ? relatedEntity : relatedEntity.name;

  if (error instanceof EntityNotFoundError) {
    return new NotFoundException(`${entityName} not found`, error);
  }

  if (error instanceof QueryFailedError) {
    const pgCode = error.driverError.code;

    switch (pgCode) {
      case '23505': // unique_violation
        return new ValidationException(`${entityName} already exists`, error);

      case '23503': // foreign_key_violation
        return new NotFoundException(`${relatedEntityName} not found`, error);

      case '23502': // not_null_violation
        return new ValidationException('A required field is missing', error);
    }
  }

  return new ServerException('Unexpected error', error);
}

export function throwDbAsAppException(error: unknown, ctx: dbCtx = {}): never {
  throw dbToAppException(error, ctx);
}
