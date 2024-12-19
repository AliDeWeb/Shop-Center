import { Test } from '@nestjs/testing';
import { RolesGuard } from '../guard/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../types/user/user.interface';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('RolesGuard (unit)', () => {
  let reflector: Reflector;
  let rolesGuard: RolesGuard;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    reflector = module.get<Reflector>(Reflector);
    rolesGuard = module.get<RolesGuard>(RolesGuard);
  });

  it('should allow access if user has the required role', async () => {
    const mockRoles: UserRole[] = ['admin'];
    const mockUser = { role: 'admin' };
    const mockContext: Partial<ExecutionContext> = {
      getHandler: jest.fn().mockReturnValue(mockRoles),
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(mockRoles as UserRole[]);

    const result = await rolesGuard.canActivate(
      mockContext as ExecutionContext,
    );

    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user role is not in roles', async () => {
    const mockRoles: UserRole[] = ['admin'];
    const mockUser = { role: 'user' };
    const mockContext: Partial<ExecutionContext> = {
      getHandler: jest.fn().mockReturnValue(mockRoles),
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(mockRoles as UserRole[]);

    const result = rolesGuard.canActivate(mockContext as ExecutionContext);

    expect(result).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user is not defined in request', async () => {
    const mockRoles: UserRole[] = ['admin'];
    const mockContext: Partial<ExecutionContext> = {
      getHandler: jest.fn().mockReturnValue(mockRoles),
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(mockRoles as UserRole[]);

    const result = rolesGuard.canActivate(mockContext as ExecutionContext);

    expect(result).rejects.toThrow(ForbiddenException);
  });
});
