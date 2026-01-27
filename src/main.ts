import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets("public")
  SwaggerConfigInit(app)
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const { PORT } = process.env
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`http://localhost:${PORT}`)
    console.log(`swagger: http://localhost:${PORT}/swagger`)
  });

}
bootstrap();