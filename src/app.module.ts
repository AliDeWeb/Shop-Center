import { Module } from '@nestjs/common';
import { LoggerModule } from './modules/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './modules/db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    LoggerModule,
    DbModule,
  ],
})
export class AppModule {}
