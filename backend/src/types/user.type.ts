import { RolesEnum } from './roles.type';

export interface AuthenticationTokenPayload {
  _id: string;
  role: RolesEnum;
}
