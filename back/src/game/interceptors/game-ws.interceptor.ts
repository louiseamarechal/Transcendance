import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Interceptor: Before...');
    const pattern = context.switchToWs().getPattern();
    const data = context.switchToWs().getData();
    console.log({ pattern }, { data });

    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        // console.log({data})
        // data.data = 'Yeeah'
        return data
      }),
      tap((data) => {
        console.log(`Interceptor: After... ${Date.now() - now}ms`);
        console.log({pattern: data?.event}, {data: data?.data});
      }),
    );
  }
}
