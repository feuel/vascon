import { Strategy } from 'passport-local';
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { ErrorMessages } from '../../../constants';

export const LocalStrategyKey = 'local';
@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  LocalStrategyKey
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateAccount(username, password);
    if (!user)
      throw new UnauthorizedException({
        username: [ErrorMessages.InvalidUsernameOrPassword],
        password: [ErrorMessages.InvalidUsernameOrPassword],
      });

    return user;
  }
}
