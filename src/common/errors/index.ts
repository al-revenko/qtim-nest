export enum AppExceptionType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  NOT_ALLOWED = 'not_allowed',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
}

export interface AppExceptionOptions {
  cause?: unknown;
  type?: AppExceptionType;
}

export class AppException extends Error {
  type: AppExceptionType;

  constructor(message: string, opts: AppExceptionOptions = {}) {
    super(message, { cause: opts.cause });
    this.type = opts.type ?? AppExceptionType.SERVER;
  }
}

export class ServerException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppExceptionType.SERVER });
  }
}

export class ValidationException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppExceptionType.VALIDATION });
  }
}

export class AuthenticationException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppExceptionType.AUTHENTICATION });
  }
}

export class NotAllowedException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppExceptionType.NOT_ALLOWED });
  }
}

export class NotFoundException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppExceptionType.NOT_FOUND });
  }
}
