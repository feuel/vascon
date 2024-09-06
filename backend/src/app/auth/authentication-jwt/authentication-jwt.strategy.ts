import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { USER_TOKEN_SECRET } from '../../../constants';
import { AuthenticationTokenPayload } from '../../../types';

export const AuthenticationJwtKey = 'authentication-jwt';
@Injectable()
export class AuthenticationJwtStrategy extends PassportStrategy(
  Strategy,
  AuthenticationJwtKey
) {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (_, rawJwtToken: string, done) => {
        let decoded: AuthenticationTokenPayload | null = null;
        try {
          decoded = jwtService.decode(rawJwtToken);
        } catch (e) {
          done(new Error());
        }

        if (!decoded) done(new Error());
        else {
          const secret = configService.get(USER_TOKEN_SECRET);
          if (secret) done(null, secret);
          else done(new Error());
        }
      },
    });
  }

  async validate(payload: AuthenticationTokenPayload) {
    return payload;
  }
}
