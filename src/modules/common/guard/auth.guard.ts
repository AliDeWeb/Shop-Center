import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import mongoose from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const cookies = request.cookies;

    if (!cookies.refreshToken || !cookies.accessToken)
      throw new ForbiddenException('login or register to continue!');

    let payload: {
      iat: number;
      exp: number;
      id: mongoose.Schema.Types.ObjectId;
      username: string;
    };
    try {
      payload = await this.jwtService.verifyAsync(cookies.accessToken);
    } catch (error) {
      throw new ForbiddenException('login or register to continue!');
    }

    // @ts-ignore
    request.user = await this.userService.getUserById(payload.id);

    return true;
  }
}
