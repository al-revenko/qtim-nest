import { ErrorResponseDto } from './dto';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
import { STATUS_CODES } from 'node:http';

export function responseErrorJSON(
  ctx: HttpArgumentsHost,
  statusCode: number,
  message: string,
) {
  const payload = plainToClass(ErrorResponseDto, {
    statusCode,
    message,
    error: getStatusCodeErrorStr(statusCode),
  });

  const response = ctx.getResponse<Response<ErrorResponseDto>>();

  response.status(statusCode).json(payload);
}

export function getStatusCodeErrorStr(statusCode: number): string {
  return STATUS_CODES[statusCode] ?? 'API error';
}

export function buildErrorResponseSchema(
  statusCode: number,
  error: string,
  message?: string,
): SchemaObject {
  const schema: SchemaObject = {
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        description: 'The HTTP status code of the error response',
        example: statusCode,
      },
      message: {
        type: 'string',
        description: 'A message describing the error',
        example: message ?? 'error description',
      },
      error: {
        type: 'string',
        description: 'Error name',
        example: error,
      },
    },
  };

  return schema;
}
