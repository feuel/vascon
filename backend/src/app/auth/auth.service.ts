import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  ErrorMessages,
  TOKEN_EXPIRY_DURATION,
  USER_TOKEN_SECRET,
} from '../../constants';
import { UsersService } from '../users/users.service';
import { REDIS_CONNECTION } from '../redis/redis.module';
import IORedis from 'ioredis';
import { AuthenticatedUserSetKey } from './constants';
import { LogoutDto } from './dto/logout.dto';
import { UserDocument } from '../users/schema/user.schema';
import { AuthenticationTokenPayload } from '../../types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
    @Inject(REDIS_CONNECTION) private redis: IORedis
  ) {}

  async login(user: UserDocument) {
    delete user.password;

    const { _id, role } = user;
    const payload: AuthenticationTokenPayload = {
      _id: _id.toString(),
      role,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(TOKEN_EXPIRY_DURATION),
      secret: this.configService.get(USER_TOKEN_SECRET),
    });

    const isLoggedIn = await this.redis.sismember(
      AuthenticatedUserSetKey,
      user.username
    );

    if (isLoggedIn)
      throw new ForbiddenException({
        username: [ErrorMessages.ActiveSessionOnAccount],
      });

    await this.redis.sadd(AuthenticatedUserSetKey, user.username);

    return {
      access_token: token,
    };
  }

  async getMe(userId: string) {
    return this.userService.getUser(userId, {
      throwOnNotFound: true,
      projection: { password: 0 },
    });
  }

  async logout(logoutDto: LogoutDto) {
    await this.redis.srem(AuthenticatedUserSetKey, logoutDto.username);
    return { message: 'All active login sessions (if any) has been removed' };
  }

  async validateAccount(username: string, requestPassword: string) {
    const user = await this.userService.getUserByUsername(username, {
      throwOnNotFound: false,
    });

    if (!user) return;

    const isPasswordValid = await bcrypt.compare(
      requestPassword,
      user.password
    );

    if (!isPasswordValid) return;

    return user.toObject();
  }
}
