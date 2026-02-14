import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initDb } from './db';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IncidentsController } from './incidents/incidents.controller';

async function bootstrap() {
  await initDb();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  try {
    const config = new DocumentBuilder()
      .setTitle('FMS Core API')
      .setDescription('API for Fire Management System core')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config, { include: [IncidentsController] });
    SwaggerModule.setup('api/docs', app, document);
  } catch (e) {
<<<<<<< HEAD
    console.warn('Swagger setup skipped:', e && e.message ? e.message : e);
=======
    console.warn('Swagger setup skipped:', (e as any)?.message ?? e);
>>>>>>> origin/001-create-frontend
  }

  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
  console.log('FMS backend listening on', process.env.PORT || 3000);
}

bootstrap();
