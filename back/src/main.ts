import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/',
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
