import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { TransformInterceptor } from './interceptors';
import helmet from 'helmet';
import { ValidationError } from 'class-validator';

function formatErrors(errors: ValidationError[]) {
  return errors.reduce((acc, err) => {
    const constraints = Object.values(err.constraints || {});
    acc[err.property] = constraints;
    return acc;
  }, {} as Record<string, string[]>);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: false,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = formatErrors(errors);
        return new BadRequestException(formattedErrors);
      },
    })
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors();
  app.use(helmet());

  const port = process.env.PORT;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}}`);
}

bootstrap();
