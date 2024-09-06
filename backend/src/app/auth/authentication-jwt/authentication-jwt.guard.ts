import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthenticationJwtKey } from './authentication-jwt.strategy';
import { IS_PUBLIC_KEY } from '../../../decorators';

@Injectable()
export class AuthenticationJwtGuard extends AuthGuard(AuthenticationJwtKey) {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }
}
