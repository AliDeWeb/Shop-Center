import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../types/user/user.interface';

export const AllowableRoles = (...roles: UserRole[]) =>
  SetMetadata('roles', roles);
