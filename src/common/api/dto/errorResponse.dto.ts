import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'The HTTP status code of the error response',
  })
  @IsInt()
  @IsNotEmpty()
  statusCode: number;

  @ApiProperty({
    description: 'A message describing the error',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string | string[];

  @ApiProperty({
    description: 'Error name',
  })
  error: string;
}
