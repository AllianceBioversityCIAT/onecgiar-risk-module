import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from 'process';
import { json, urlencoded } from 'express';
import dataSource from 'db/data-source';

async function bootstrap() {
  dataSource.initialize()
  .then(() => {
    console.log("Data Source initialized!");
  })
  .catch((error) => {
    console.error("Error initializing Data Source:", error);
  });
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(env.APP_Prefix || '');
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));
  const config = new DocumentBuilder()
    .setTitle('Risk Module')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(env.APP_Prefix || '', app, document);
  await app.listen(env.APP_PORT);
}
bootstrap();
