import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ApiErrorResponse } from 'src/common/api/decorators';
import {
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from './dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: SignUpResponseDto })
  @ApiErrorResponse(400)
  async signUp(
    @Body(new ValidationPipe()) signUpDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const result = await this.authService.signUp(
      signUpDto.username,
      signUpDto.password,
    );

    return {
      userId: result.user.id,
      accessToken: result.access_token,
    };
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiOkResponse({ type: SignInResponseDto })
  @HttpCode(200)
  @ApiErrorResponse(400)
  @ApiErrorResponse(401)
  async signIn(
    @Body(new ValidationPipe()) signInDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const result = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    return {
      accessToken: result.access_token,
    };
  }
}
