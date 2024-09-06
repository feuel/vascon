export const ErrorMessages = {
  ActiveSessionOnAccount:
    'There is already an active session using your account',
  InvalidUsernameOrPassword: 'Invalid username or password',
  NoUsernameOrPassword: 'No username or password',
  NoUserWithProvidedUserName: 'No user with the provided username found',
  UserNotFound: 'User not found',
  UserWithProvidedUserNameExists: 'User exists with the provided username',
  InsufficientCoins: "You don't have enough coins",
  InsufficientCoinVariant: (balance: number, coinUnavailable: number) =>
    `Your balance is ${balance} coins, but don't have denominations for ${coinUnavailable} coins`,
  OneOrMoreProductNotFound: 'One or more products not found',
  ProductNotFound: 'Product not found',
  InsufficientProduct: (productName: string, remaining: number) =>
    remaining === 0
      ? `${productName} is out of stock`
      : `Only ${remaining} ${productName} remaining`,
};
