import { ApiResponse } from '@nestjs/swagger';
import {
  applyDecorators,
  ClassSerializerInterceptor,
  HttpCode,
  SerializeOptions,
  Type,
  UseInterceptors,
} from '@nestjs/common';

interface AppResponseOptions {
  type: Type<any>;
  exposeOnlyProps?: boolean;
}

export function AppResponse(statusCode: number, options: AppResponseOptions) {
  const { exposeOnlyProps = true, type } = options;

  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({ type, excludeExtraneousValues: exposeOnlyProps }),
    HttpCode(statusCode),
    ApiResponse({
      status: statusCode,
      type,
    }),
  );
}
