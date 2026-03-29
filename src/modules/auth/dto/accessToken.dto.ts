import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({
    description: 'User access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsIm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.O0AwPv9WMQZoT5Ai12jbRfa4lpoRhzo65FXva56DJyc',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  accessToken: string;
}
