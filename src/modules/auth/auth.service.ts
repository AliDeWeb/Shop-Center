import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getEnv } from '../../utils/getEnv/getEnvs.util';
import { CreateUserDto } from '../../exports/shared/dto/shared.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private generateToken(payload: any, expiresIn: string): string {
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn,
    });
  }

  private hash(pass: string) {
    return bcrypt.hash(pass, Number(getEnv('BCRYPT_SALT')));
  }

  async registerUser(
    body: CreateUserDto,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const hashedPassword = await this.hash(body.password);

    const newUser = await this.userService.createUser({
      ...body,
      password: hashedPassword,
    });

    const payload = { id: newUser._id, username: newUser.username };
    const accessToken = this.generateToken(
      payload,
      getEnv('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    );
    const refreshToken = this.generateToken(
      payload,
      getEnv('JWT_ACCESS_REFRESH_EXPIRES_IN'),
    );
    const refreshTokenExpiresIn =
      Date.now() +
      parseInt(getEnv('JWT_ACCESS_REFRESH_EXPIRES_IN')) * 24 * 60 * 60 * 1000;
    const hashedRefreshToken = await this.hash(refreshToken);

    newUser.refreshTokens.push({
      token: hashedRefreshToken,
      expires_in: refreshTokenExpiresIn,
    });
    await newUser.save();

    return { refreshToken, accessToken };
  }

  async loginUser(
    body: LoginUserDto,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const user = (
      await this.userService.findUser({ username: body.username })
    )[0];

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!isPasswordCorrect)
      throw new UnauthorizedException('wrong username or password');

    const payload = { id: user._id, username: user.username };
    const accessToken = this.generateToken(
      payload,
      getEnv('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    );
    const refreshToken = this.generateToken(
      payload,
      getEnv('JWT_ACCESS_REFRESH_EXPIRES_IN'),
    );
    const refreshTokenExpiresIn =
      Date.now() +
      parseInt(getEnv('JWT_ACCESS_REFRESH_EXPIRES_IN')) * 24 * 60 * 60 * 1000;
    const hashedRefreshToken = await this.hash(refreshToken);

    user.refreshTokens.push({
      token: hashedRefreshToken,
      expires_in: refreshTokenExpiresIn,
    });
    await user.save();

    return { refreshToken, accessToken };
  }
}
