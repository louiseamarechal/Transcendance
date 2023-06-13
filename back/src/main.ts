import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // const corsOptions: CorsOptions = {
  //   allowedHeaders: ['content-type', 'Authorization', 'Access-Control-Allow-Origin'],
  //   origin: ['http://localhost:3000'],
  // }
  // app.enableCors(corsOptions);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
