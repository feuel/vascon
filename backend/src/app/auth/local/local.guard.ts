import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalStrategyKey } from './local.strategy';
import { ErrorMessages } from '../../../constants';

const BAD_REQUEST_MESSAGE = 'BAD_REQUEST';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LocalStrategyKey) {
  options = {
    badRequestMessage: BAD_REQUEST_MESSAGE,
  };

  handleRequest(err: HttpException | Error, user: any, info: any) {
    if (info?.message === BAD_REQUEST_MESSAGE)
      throw new BadRequestException({
        username: [ErrorMessages.NoUsernameOrPassword],
        password: [ErrorMessages.NoUsernameOrPassword],
      });

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(ErrorMessages.InvalidUsernameOrPassword)
      );
    }
    return user;
  }
}
