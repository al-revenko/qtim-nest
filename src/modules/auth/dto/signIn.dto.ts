import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';
import { AccessTokenDto } from './accessToken.dto';

export class SignInRequestDto {
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

export class SignInResponseDto extends AccessTokenDto {}
