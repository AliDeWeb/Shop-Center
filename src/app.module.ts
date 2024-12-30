import { Module } from '@nestjs/common';
import { LoggerModule } from './modules/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './modules/db/db.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { ProductModule } from './modules/product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { path as uploadedFilesPath } from './utils/multer/multer.util';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, `../${uploadedFilesPath.split('/')[0]}`),
    }),
    LoggerModule,
    DbModule,
    UserModule,
    AuthModule,
    CommonModule,
    ProductModule,
  ],
})
export class AppModule {}
