import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../exports/shared/dto/shared.dto';
import { Response, Request } from 'express';
import { getEnv } from '../../utils/getEnv/getEnvs.util';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserReq } from '../../types/user/user.interface';
import { Schema } from 'mongoose';
import { AuthGuard } from '../common/guard/auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private sendCookies(
    res: Response,
    result: { refreshToken: string; accessToken: string },
  ) {
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
  }

  @Post('register')
  @HttpCode(201)
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

    this.sendCookies(res, result);

    res.status(201).json({ message: 'welcome to shop center' });
  }

  @Post('login')
  @HttpCode(200)
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

    this.sendCookies(res, result);

    res.status(200).json({ message: 'welcome back to shop center' });
  }

  @Get('access-token')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get access token',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'successfully generated access token',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'user did not provide a valid token',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'login or register to continue!',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: '403',
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
  async generateNewAccessToken(@Res() res: Response, @Req() req: Request) {
    const result = await this.authService.generateNewAccessToken(
      req.cookies.refreshToken,
    );

    this.sendCookies(res, result);

    res.status(200).json({ message: 'successfully generated access token' });
  }

  @Patch('logout')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Logout of all sessions',
    schema: {
      properties: {
        message: { type: 'string', example: 'logout successfully' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'user did not provide a valid token',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'login or register to continue!',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: '403',
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
  async logout(@Req() req: IUserReq) {
    await this.authService.logout(req.user._id as Schema.Types.ObjectId);

    return { message: 'logout successfully' };
  }
}
