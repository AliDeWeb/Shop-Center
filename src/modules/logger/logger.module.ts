import {
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { RequestLoggerMiddleware } from 'src/middlewares/logger.middleware';

@Module({})
export class LoggerModule {
  configure(
    consumer: MiddlewareConsumer,
  ) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
