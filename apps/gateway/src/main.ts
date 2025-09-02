import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { setApp } from './app';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  setApp(app);
  app.use(express.json({ limit: '50mb' }));
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();