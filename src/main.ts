import 'reflect-metadata';
import '@fastify/static';

import { Controller, Get, INestApplication, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Controller()
class AppController {
  @Get('/health')
  health() {
    return { ok: true };
  }
}

@Module({
  controllers: [AppController]
})
class AppModule {}

async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const config = new DocumentBuilder().setTitle('Repro').setVersion('1').build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, doc);

  await app.init();
  return app;
}

bootstrap()
  .then(async app => {
    console.log('Bootstrap success');
    await app.close();
  })
  .catch(err => {
    console.error('Bootstrap failed');
    console.error(err);
    process.exit(1);
  });
