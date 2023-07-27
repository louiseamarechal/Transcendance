import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const url = context.switchToHttp().getRequest().originalUrl;
    const method = context.switchToHttp().getRequest().method;
    Logger.debug(`${method} ${url} ${isPublic ? '(public)' : '(private)'}`);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
