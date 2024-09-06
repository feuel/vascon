import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseWrapper } from '../utils';

export interface Response<T> {
  data: T;
  [key: string]: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((result) => {
        if (result instanceof ResponseWrapper) {
          return {
            data: {
              data: result.data,
              ...result.metadata,
            },
          };
        } else
          return {
            data: result,
          };
      })
    );
  }
}
