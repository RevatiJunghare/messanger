import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService)

  const USER = configService.get('RABBITMQ_USER')
  const PASSWORD = configService.get('RABBITMQ_PASS')
  const HOST = configService.get('RABBITMQ_HOST')
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options:{
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}:5672`],
      noAck: false,
      queue: QUEUE,
      queueOptions:{
        durable:true
      }
    }
  });

  await app.startAllMicroservices();
  logger.log('Microservice is listening');
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
