// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T | null;
  message: string;
  success: boolean;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const successMessage = this.reflector.get<string>('responseMessage', context.getHandler()) || 'Request successful';

    return next.handle().pipe(
      map((data) => ({
        data,
        message: successMessage,
        success: true,
      })),
    );
  }
}
