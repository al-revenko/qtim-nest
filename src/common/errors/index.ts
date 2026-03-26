export enum AppErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  NOT_ALLOWED = 'not_allowed',
  NOT_FOUND = 'not_found',
  CLIENT = 'client',
  SERVER = 'server',
}

export interface AppErrorOptions {
  cause?: unknown;
  type?: AppErrorType;
}

export class AppException extends Error {
  type: AppErrorType;

  constructor(message: string, opts: AppErrorOptions = {}) {
    super(message);
    this.type = opts.type ?? AppErrorType.SERVER;
  }
}

export class ClientException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppErrorType.CLIENT });
  }
}

export class ServerException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppErrorType.SERVER });
  }
}

export class ValidationException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppErrorType.VALIDATION });
  }
}

export class AuthenticationException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppErrorType.AUTHENTICATION });
  }
}

export class NotAllowedException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppErrorType.NOT_ALLOWED });
  }
}

export class NotFoundException extends AppException {
  constructor(message: string, cause?: unknown) {
    super(message, { cause, type: AppErrorType.NOT_FOUND });
  }
}
