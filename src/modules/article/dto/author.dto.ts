import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AuthorDto {
  @ApiProperty({
    description: 'The ID of the author',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The username of the author',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  username: string;
}
