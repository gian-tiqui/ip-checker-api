import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders:
      'Origin, Content-Type, Authorization, X-Requested-With, Cache-Control, x-api-key',
    credentials: true,
    methods: ['GET'],
    origin: ['http://localhost:5173'],
  });

  await app.listen(8082);
}
bootstrap();
