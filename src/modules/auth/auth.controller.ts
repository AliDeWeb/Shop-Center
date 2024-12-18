import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../exports/shared/dto/shared.dto';
import { Response } from 'express';
import { getEnv } from '../../utils/getEnv/getEnvs.util';
import { ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'Register a user',
    schema: { properties: { message: { type: 'string', example: 'welcome' } } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid body request',
    schema: {
      properties: {
        message: {
          type: 'array',
          example: [
            'username must be a maximum 20 characters',
            'name must be at least 3 characters',
            'password must be at least 8 characters',
          ],
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          example: '400',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Duplicate user',
    schema: {
      properties: {
        message: { type: 'string', example: 'user exist' },
        error: { type: 'string', example: 'error' },
        statusCode: {
          type: 'number',
          example: '409',
        },
      },
    },
  })
  async registerUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const result = await this.authService.registerUser(body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: getEnv('NODE_ENV') === 'production',
    });
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: getEnv('NODE_ENV') === 'production',
    });

    res.status(201).json({ message: 'welcome to shop center' });
  }

  @Post('/login')
  @ApiResponse({
    status: 200,
    description: 'Login user',
    schema: { properties: { message: { type: 'string', example: 'welcome' } } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid body request',
    schema: {
      properties: {
        message: {
          type: 'array',
          example: [
            'username must be a maximum 20 characters',
            'name must be at least 3 characters',
            'password must be at least 8 characters',
          ],
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          example: '400',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found user',
    schema: {
      properties: {
        message: { type: 'string', example: 'user not found' },
        error: { type: 'string', example: 'error' },
        statusCode: {
          type: 'number',
          example: '404',
        },
      },
    },
  })
  async loginUser(@Body() body: LoginUserDto, @Res() res: Response) {
    const result = await this.authService.loginUser(body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: getEnv('NODE_ENV') === 'production',
    });
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: getEnv('NODE_ENV') === 'production',
    });

    res.status(200).json({ message: 'welcome back to shop center' });
  }
}
