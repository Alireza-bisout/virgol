import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app)
  const { PORT } = process.env
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`http://localhost:${PORT}`)
    console.log(`swagger: http://localhost:${PORT}/swagger`)
  });

}
bootstrap();