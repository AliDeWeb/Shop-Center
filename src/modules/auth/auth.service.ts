import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getEnv } from '../../utils/getEnv/getEnvs.util';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import mongoose, { Schema } from 'mongoose';

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

  private hash(pass: string): Promise<string> {
    return bcrypt.hash(pass, Number(getEnv('BCRYPT_SALT')));
  }

  async registerUser(
    body: CreateUserDto,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const newUser = await this.userService.createUser(body);

    const payload = { id: newUser._id, username: newUser.username };
    const accessToken = this.generateToken(
      payload,
      getEnv('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    );
    const refreshToken = this.generateToken(
      payload,
      getEnv('JWT_ACCESS_REFRESH_EXPIRES_IN'),
    );

    const hashedRefreshToken = await this.hash(refreshToken);

    newUser.refreshTokens.push(hashedRefreshToken);
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

    const hashedRefreshToken = await this.hash(refreshToken);

    user.refreshTokens.push(hashedRefreshToken);
    if (user.refreshTokens.length > Number(getEnv('MAX_ACTIVE_SESSIONS')))
      user.refreshTokens.shift();
    await user.save();

    return { refreshToken, accessToken };
  }

  async generateNewAccessToken(refreshToken: string | undefined) {
    let payload: {
      iat: number;
      exp: number;
      id: mongoose.Schema.Types.ObjectId;
      username: string;
    };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch (error) {
      throw new ForbiddenException('login or register to continue!');
    }

    const user = await this.userService.getUserById(payload.id);

    let isRefreshTokenValid: boolean = false;
    for (let token of user.refreshTokens) {
      const matchCompareResult: boolean = await bcrypt.compare(
        refreshToken,
        token,
      );

      if (matchCompareResult) isRefreshTokenValid = true;
    }

    if (!isRefreshTokenValid)
      throw new ForbiddenException('login or register to continue!');

    const newPayload = {
      id: payload.id,
      username: payload.username,
    };
    const accessToken = this.generateToken(
      newPayload,
      getEnv('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    );

    return { refreshToken, accessToken };
  }

  async logout(id: Schema.Types.ObjectId) {
    const user = await this.userService.getUserById(id);

    user.refreshTokens.splice(0, user.refreshTokens.length);
    await user.save();
  }
}
