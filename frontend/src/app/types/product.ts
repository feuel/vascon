import { UserCoinInterface } from './user';

export interface ProductInterface {
  name: string;
  amount_available: number;
  cost: number;
  seller: string;
  _id: string;
}

export interface CartProductInterface {
  name: string;
  quantity: number;
  cost: number;
  _id: string;
}

export interface ProductPurchaseResponseInterface {
  amount_spent: number;
  user_balance: UserCoinInterface[];
  products: {
    name: string;
    cost: number;
    total: number;
    quantity: number;
  }[];
}
