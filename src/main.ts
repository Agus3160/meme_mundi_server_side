import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomHttpExecptionFilter } from './utils/error/CustomHttpExecptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomHttpExecptionFilter());
  app.enableCors({origin: 'http://localhost:3000', credentials: true});
  await app.listen(8000);
}
bootstrap();
