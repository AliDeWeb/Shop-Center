import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getEnv } from './utils/getEnv/getEnvs.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Shop-Center APIs Documentation')
    .setDescription(
      'Shop-Center is a backend service developed by AliDeWeb using NestJs.',
    )
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, documentFactory);

  await app.listen(getEnv('PORT'));
}
bootstrap();
