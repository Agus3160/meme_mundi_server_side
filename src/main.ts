import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { CustomHttpExecptionFilter } from './utils/error/CustomHttpExecptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get("Reflector");
  app.useGlobalFilters(new CustomHttpExecptionFilter());
  await app.listen(8000);
}
bootstrap();
