import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../types/user/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!req.user)
      throw new ForbiddenException(
        'you do not have permission to do this action',
      );

    if (!roles.includes(req.user.role))
      throw new ForbiddenException(
        'you do not have permission to do this action',
      );

    return true;
  }
}
