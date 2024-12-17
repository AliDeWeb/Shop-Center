import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { testDBUri } from '../../../../test/test-utils';
import { UserModule } from '../../user/user.module';
import { AuthService } from '../auth.service';
import mongoose from 'mongoose';
import { getEnv } from '../../../utils/getEnv/getEnvs.util';
import { JwtModule } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';

describe('AuthService (e2e)', () => {
  const uri = testDBUri;
  let service: AuthService;

  beforeAll(async () => {
    process.env.JWT_SECRET_KEY = '12345678';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '5m';
    process.env.JWT_ACCESS_REFRESH_EXPIRES_IN = '7d';
    process.env.BCRYPT_SALT = '5';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        JwtModule.registerAsync({
          useFactory: async () => ({ secret: getEnv('JWT_SECRET_KEY') }),
        }),
        UserModule,
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register user', () => {
    it('should create a new user and return refresh and access tokens if user does not exist', async () => {
      const user = {
        name: 'Ali',
        username: 'AliDeWeb',
        email: 'alimoradi0business@gmail.com',
        password: '12345678',
      };

      const newUser = await service.registerUser(user);

      expect(newUser).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });

  it('should throw an error if the user already exists', async () => {
    const existingUser = {
      name: 'exist',
      username: 'exist',
      email: 'exist@gmail.com',
      password: '12345678',
    };

    await service.registerUser(existingUser);

    await expect(service.registerUser(existingUser)).rejects.toThrow(
      ConflictException,
    );
  });
});
