import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as XLSX from 'xlsx';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'entities/user.entitiy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { query } from 'express';
import { ILike } from 'typeorm';
import { createAndUpdateUsers, exportToExcel, getUsers } from 'DTO/users.dto';
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
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'ASC' };
  }
  @Get()
  @ApiCreatedResponse({
    description: '',
    type: getUsers,
  })
  getUsers(@Query() query) {
    return this.usersService.userRepository.find({
      where: {
        full_name: query?.full_name ? ILike(`%${query?.full_name}%`) : null,
        email: query?.email ? ILike(`%${query?.email}%`) : null,
        id: query?.id ? query?.id : null,
        role: query?.role ? query?.role : null,
      },
      order: { ...this.sort(query) },
    });
  }

  @Put()
  @ApiBody({ type : createAndUpdateUsers })
  @ApiCreatedResponse({
    description: '',
    type: createAndUpdateUsers,
  })
  updateUser(@Body() data: any) {
    const user = this.usersService.userRepository.create();
    if(data?.email)
    data['email'] = data?.email.toLowerCase()
    Object.assign(user, data);
    return this.usersService.userRepository.save(user, { reload: true });
  }

  @Post()
  @ApiBody({ type : createAndUpdateUsers })
  @ApiCreatedResponse({
    description: '',
    type: createAndUpdateUsers,
  })
  async addUser(@Body() data: any) {
    const user = this.usersService.userRepository.create();
    if(data?.email)
    data['email'] = data?.email.toLowerCase()
    Object.assign(user, data);
    await this.usersService.userRepository.save(user, { reload: true });

    return user;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.userRepository.delete(id);
  }
  @Get('export/all')
  @ApiCreatedResponse({
    description: '',
    type: exportToExcel,
  })
  async export() {
    let users = await this.usersService.userRepository.find();
    console.log(users)
    const file_name = 'All-Users.xlsx';
    var wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(users);

    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    await XLSX.writeFile(wb, join(process.cwd(), 'generated_files', file_name));
    const file = createReadStream(
      join(process.cwd(), 'generated_files', file_name),
    );

    setTimeout(async () => {
      try {
        await unlink(join(process.cwd(), 'generated_files', file_name));
      } catch (e) {}
    }, 9000);
    return new StreamableFile(file, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file_name}"`,
    });
  }
}
