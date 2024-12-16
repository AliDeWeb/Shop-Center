import { Module } from '@nestjs/common';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [LoggerModule],
})
export class AppModule {}
