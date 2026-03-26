import { ApiResponse } from '@nestjs/swagger';
import { buildErrorResponseSchema, getStatusCodeMessage } from '../utils';

export function ApiErrorResponse(statusCode: number) {
  const message = getStatusCodeMessage(statusCode);

  return ApiResponse({
    status: statusCode,
    description: message ?? `API error`,
    schema: buildErrorResponseSchema(statusCode, message),
  });
}
