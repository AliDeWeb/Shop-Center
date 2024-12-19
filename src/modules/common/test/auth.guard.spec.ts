import { Test } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../guard/auth.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { IUserDocument } from '../../../types/user/user.interface';

describe('AuthGuard (unit)', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let authGuard: AuthGuard;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: UserService, useValue: { getUserById: jest.fn() } },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return true if the tokens are valid and user exists', async () => {
    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            accessToken: 'validAccessToken',
            refreshToken: 'validRefreshToken',
          },
        }),
      }),
    } as ExecutionContext;

    const mockPayload = {
      iat: 1672531200,
      exp: Math.floor(Date.now() / 1000) + 1000,
      id: 'userId',
      username: 'testUser',
    };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);
    jest
      .spyOn(userService, 'getUserById')
      .mockResolvedValue({ _id: 'testUser' } as IUserDocument);

    const result = await authGuard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('validAccessToken');
    expect(userService.getUserById).toHaveBeenCalledWith(mockPayload.id);
  });

  it('should throw ForbiddenException if tokens are missing', async () => {
    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            accessToken: undefined,
            refreshToken: undefined,
          },
        }),
      }),
    } as ExecutionContext;

    const result = authGuard.canActivate(mockContext as ExecutionContext);

    expect(result).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if accessToken is invalid', async () => {
    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            accessToken: 'invalid',
            refreshToken: 'invalid',
          },
        }),
      }),
    } as ExecutionContext;

    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('invalid token'));

    const result = authGuard.canActivate(mockContext as ExecutionContext);

    expect(result).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if token is expired', async () => {
    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            accessToken: 'validAccessToken',
            refreshToken: 'validRefreshToken',
          },
        }),
      }),
    } as ExecutionContext;

    const mockPayload = {
      iat: 1672531200,
      exp: Math.floor(Date.now() / 1000) - 1000,
      id: 'userId',
      username: 'testUser',
    };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

    const result = authGuard.canActivate(mockContext as ExecutionContext);

    expect(result).rejects.toThrow(ForbiddenException);
  });
});
