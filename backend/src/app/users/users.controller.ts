import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, CreditUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { Public } from '../../decorators';
import { ResourceAccessGuard, RolesGuard } from '../../guards';

const UserIdKey = 'user_id'; // To use for user id parameter
const GetUserPath = (path?: string) => `:${UserIdKey}${path ? `${path}` : ''}`;

@Controller('users')
@UseGuards(
  RolesGuard,
  ResourceAccessGuard({
    requestParameterAccessor: `params.${UserIdKey}`,
    userParameterAccessor: '_id',
  })
)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Public()
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(GetUserPath())
  getUser(@Param(UserIdKey) userId: string) {
    return this.usersService.getUser(userId, {
      throwOnNotFound: true,
      projection: { password: 0 },
    });
  }

  @Patch(GetUserPath())
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param(UserIdKey) userId: string
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(GetUserPath())
  deleteUser(@Param(UserIdKey) userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
