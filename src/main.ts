import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './utils/getEnv/getEnvs.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(getEnv('PORT'));
}
bootstrap();
