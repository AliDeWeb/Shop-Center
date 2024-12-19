import { Module } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { getEnv } from '../../utils/getEnv/getEnvs.util';
import { UserModule } from '../user/user.module';
import { RolesGuard } from './guard/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({ secret: getEnv('JWT_SECRET_KEY') }),
    }),
    UserModule,
  ],
  providers: [AuthGuard, RolesGuard],
})
export class CommonModule {}
