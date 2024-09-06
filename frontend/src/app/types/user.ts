export enum UserRoleEnum {
  Buyer = 'buyer',
  Seller = 'seller',
}

export interface UserCoinInterface {
  coin: number;
  quantity: number;
}

export interface UserInterface {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  role: UserRoleEnum;
  balance: number;
  deposit: UserCoinInterface[];
}
