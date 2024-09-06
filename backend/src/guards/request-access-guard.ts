import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { AuthenticationTokenPayload } from '../types';

const getFromRecord = (record: Record<string, any>, key: string) => {
  return key
    .split('.')
    .reduce((value, property) => value && value[property], record);
};

type Accessor<T> = string | ((data: T) => any);

type ResourceAccessOptionsInterface = {
  requestParameterAccessor: Accessor<Request>;
  userParameterAccessor: Accessor<AuthenticationTokenPayload>;
  comparatorFunction?: (requestData: any, userData: any) => boolean;
};

export function ResourceAccessGuard({
  requestParameterAccessor,
  userParameterAccessor,
  comparatorFunction = (a, b) => a === b,
}: ResourceAccessOptionsInterface) {
  @Injectable()
  class MixinGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();

      const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) return true;

      const user = request.user as AuthenticationTokenPayload;

      const requestParameter =
        typeof requestParameterAccessor === 'function'
          ? requestParameterAccessor(request)
          : getFromRecord(request, requestParameterAccessor);

      const userDataParameter =
        typeof userParameterAccessor === 'function'
          ? userParameterAccessor(user)
          : getFromRecord(user, userParameterAccessor);

      return comparatorFunction(requestParameter, userDataParameter);
    }
  }
  return mixin(MixinGuard) as Type<CanActivate>;
}
