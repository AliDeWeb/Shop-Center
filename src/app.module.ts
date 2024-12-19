import { Module } from '@nestjs/common';
import { LoggerModule } from './modules/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './modules/db/db.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    LoggerModule,
    DbModule,
    UserModule,
    AuthModule,
    CommonModule,
  ],
})
export class AppModule {}
