import { SetMetadata } from '@nestjs/common';

export const ErrorMessage = (message: string) =>
  SetMetadata('errorMessage', message);
