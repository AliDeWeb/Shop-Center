import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      ({
        timestamp,
        level,
        message,
      }) => {
        return `${timestamp} [${level.toUpperCase()}] ${message}`;
      },
    ),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
});

@Injectable()
export class RequestLoggerMiddleware
  implements NestMiddleware
{
  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const {
      method,
      originalUrl,
      headers,
      body,
      ip,
    } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration =
        Date.now() - start;

      const logMessage = `
      Method: ${method}
      URL: ${originalUrl}
      IP: ${ip}
      Headers: ${JSON.stringify(headers)}
      Body: ${JSON.stringify(body)}
      StatusCode: ${statusCode}
      Duration: ${duration}ms
      `;

      logger.info(logMessage);
    });

    next();
  }
}
