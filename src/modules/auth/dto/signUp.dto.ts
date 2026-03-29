import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AccessTokenDto } from './accessToken.dto';
import { Expose } from 'class-transformer';

export class SignUpRequestDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
    minLength: 4,
    maxLength: 30,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 8,
    maxLength: 60,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(60)
  password: string;
}

export class SignUpResponseDto extends AccessTokenDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: 12,
  })
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  userId: number;
}
