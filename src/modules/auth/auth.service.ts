import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getEnv } from '../../utils/getEnv/getEnvs.util';
import { CreateUserDto } from '../../exports/shared/dto/shared.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: getEnv('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  private generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: getEnv('JWT_ACCESS_REFRESH_EXPIRES_IN'),
    });
  }

  private verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('invalid token');
    }
  }

  private hash(pass: string) {
    return bcrypt.hash(pass, Number(getEnv('BCRYPT_SALT')));
  }

  async registerUser(body: CreateUserDto) {
    const hashedPassword = await this.hash(body.password);

    const newUser = await this.userService.createUser({
      ...body,
      password: hashedPassword,
    });

    const payload = { id: newUser.id, username: newUser.username };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    const hashedRefreshToken = await this.hash(refreshToken);

    newUser.refreshTokens.push(hashedRefreshToken);
    await newUser.save();

    return { refreshToken, accessToken };
  }
}
