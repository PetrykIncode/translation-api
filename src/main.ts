import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup middleware
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      // Exclude properties that you don't want to include in the response
      excludeExtraneousValues: true,
    }),
  );
  app.enableCors();
  app.use(cookieParser());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Translation')
    .setDescription('Translation API documentation')
    .setVersion('0.0.1')
    .addSecurity('Bearer', {
      type: 'http',
      scheme: 'Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  // Run server
  await app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}
bootstrap();
