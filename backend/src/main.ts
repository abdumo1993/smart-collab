import './common/sentry/instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors({
    origin: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(app.getHttpAdapter()));

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('ISS API')
    .setDescription('ISS API Documentation')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Start all microservices
  await app.startAllMicroservices();
  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

void bootstrap();
