import { ApiResponse } from '@nestjs/swagger';
import { buildErrorResponseSchema, getStatusCodeErrorStr } from '../utils';
import { applyDecorators } from '@nestjs/common';

export function AppErrorResponse(statusCode: number[] | number) {
  if (Array.isArray(statusCode)) {
    const decorators = statusCode.map((statusCode) =>
      ApiResponse({
        status: statusCode,
        description: getStatusCodeErrorStr(statusCode),
        schema: buildErrorResponseSchema(
          statusCode,
          getStatusCodeErrorStr(statusCode),
        ),
      }),
    );

    return applyDecorators(...decorators);
  }

  return ApiResponse({
    status: statusCode,
    description: getStatusCodeErrorStr(statusCode),
    schema: buildErrorResponseSchema(
      statusCode,
      getStatusCodeErrorStr(statusCode),
    ),
  });
}
