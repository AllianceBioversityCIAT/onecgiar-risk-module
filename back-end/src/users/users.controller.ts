import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'entities/user.entitiy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiCreatedResponse({
  description: '',
  type: [User],
})
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.userRepository.find();
  }

  @Put()
  updateUser(@Body() data: any) {
    const user = this.usersService.userRepository.create();
    Object.assign(user, data);
    return this.usersService.userRepository.save(user, { reload: true });
  }

  @Post()
  async addUser(@Body() data: any) {
    const user = this.usersService.userRepository.create();
    Object.assign(user, data);
    await this.usersService.userRepository.save(user, { reload: true });

    return user;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.userRepository.delete(id);
  }
}
