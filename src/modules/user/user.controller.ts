import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUserDocument } from '../../types/user/user.interface';
import { AuthGuard } from '../common/guard/auth.guard';
import { User } from './dto/user.dto';

@Controller('user')
@ApiTags('User')
@ApiCookieAuth()
export class UserController {
  constructor() {}

  @Get('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: User })
  @ApiResponse({
    status: 200,
    description: 'User Info',
    schema: {
      properties: {
        name: { type: 'string', example: 'ali' },
        email: { type: 'string', example: 'ali@gmail.com' },
        username: { type: 'string', example: 'ali1234' },
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
  getMe(@Req() req: Request & { user: IUserDocument }) {
    const { username, email, name } = req.user;

    return { username, email, name };
  }
}
