import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { CreateUserDto, CreditUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ErrorMessages } from '../../constants';
import { CoinDto } from '../../dto';
import { evaluateBalanceForDebit } from '../../utils';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto) {
    const userWithUsername = await this.getUserByUsername(
      createUserDto.username,
      { throwOnNotFound: false }
    );

    if (userWithUsername)
      throw new BadRequestException({
        username: [ErrorMessages.UserWithProvidedUserNameExists],
      });

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALT_ROUNDS
    );

    // Replace the password in the DTO with the hashed password
    createUserDto.password = hashedPassword;

    const user = new this.userModel(createUserDto);
    const newUser = (await user.save()).toObject();

    delete newUser.password;

    return newUser;
  }

  async getUserByUsername(
    username: string,
    { throwOnNotFound = true, projection = undefined } = {}
  ) {
    const user = await this.userModel.findOne({ username }, projection);

    if (!user && throwOnNotFound)
      throw new NotFoundException({
        username: [ErrorMessages.NoUserWithProvidedUserName],
      });

    return user;
  }

  async getUser(
    userId: string,
    { throwOnNotFound = true, projection = undefined } = {}
  ) {
    const user = await this.userModel.findById(userId, projection);

    if (!user && throwOnNotFound)
      throw new NotFoundException({
        _id: [ErrorMessages.UserNotFound],
      });

    return user;
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser)
      throw new NotFoundException({
        _id: [ErrorMessages.UserNotFound],
      });
    return {
      message: 'User deleted',
    };
  }
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: updateUserDto,
      },
      {
        new: true,
        projection: {
          password: 0,
        },
      }
    );

    if (!user)
      throw new NotFoundException({
        _id: [ErrorMessages.UserNotFound],
      });
    return user;
  }

  async creditUser(userId: string, creditAccountDto: CreditUserDto) {
    const { coins } = creditAccountDto;
    const userData = await this.getUser(userId, { throwOnNotFound: true });
    const allCoins = coins.concat(userData.deposit);
    const coinsMap: Record<number, CoinDto> = {};

    let totalCoins = 0;
    allCoins.forEach(({ coin, quantity }) => {
      if (coinsMap[coin]) coinsMap[coin].quantity += quantity;
      else coinsMap[coin] = { coin, quantity };
      totalCoins += quantity * coin;
    });

    const updatedCoins = Object.values(coinsMap);

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          deposit: updatedCoins,
          balance: totalCoins,
        },
      },
      { new: true, projection: { deposit: 1 } }
    );

    return user.deposit;
  }

  async clearDeposit(userId: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          deposit: [],
          balance: 0,
        },
      },
      { new: true }
    );

    if (!updatedUser) throw new NotFoundException(ErrorMessages.UserNotFound);

    return {
      message: 'Balance cleared',
    };
  }

  async updateUserBalance(
    purchaseUser: User & { _id: Types.ObjectId },
    purchaseAmount: number,
    change: CoinDto[],
    session: ClientSession
  ) {
    const { _id, deposit } = purchaseUser;
    deposit.sort((a, b) => b.coin - a.coin);

    const updatedUserData = await this.userModel.findByIdAndUpdate(
      _id,
      {
        $set: { deposit: change },
        $inc: { balance: -1 * purchaseAmount },
      },
      { session, new: true, projection: { deposit: 1 } }
    );

    return updatedUserData.deposit;
  }

  validateUserAbilityToPurchase(user: UserDocument, amount: number) {
    if (user.balance < amount)
      throw new ForbiddenException({
        coins: [ErrorMessages.InsufficientCoins],
      });

    const { unpayable, change } = evaluateBalanceForDebit(user.deposit, amount);

    if (unpayable > 0)
      throw new ForbiddenException({
        coins: [ErrorMessages.InsufficientCoinVariant(user.balance, unpayable)],
      });

    return change;
  }
}
