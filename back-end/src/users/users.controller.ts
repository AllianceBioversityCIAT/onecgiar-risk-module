import {
  BadRequestException,
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
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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
  async getUsers(@Query() query) {
    if(query.search == 'teamMember') {
      return this.usersService.userRepository.createQueryBuilder('users')
      .where("users.full_name like :full_name", { full_name: `%${query.full_name}%` })
      .orWhere("users.email like :email", { email: `%${query.email}%` })
      .select(['users.id as id', 'users.full_name as full_name', 'users.email as email'])
      .getRawMany()
    }
    else {
      const take = query.limit || 10
      const skip=(Number(query.page)-1)*take;
      const [result, total] = await this.usersService.userRepository.findAndCount({
        where: {
          // full_name: query?.searchValue ? ILike(`%${query?.searchValue}%`) : null,
          email: query?.email ? ILike(`%${query?.email}%`) : null,
          // id: query?.id ? query?.id : null,
          role: query?.role ? query?.role : null,
        },
        order: { ...this.sort(query) },
        take: take == null ? null : take,
        skip: skip == null ? null : skip,
      });
      return {
        result: result,
        count: total
    }
    }
  }
  @Roles(Role.Admin)
  @Put()
  @ApiBody({ type : createAndUpdateUsers })
  @ApiCreatedResponse({
    description: '',
    type: createAndUpdateUsers,
  })
  async updateUser(@Body() data: any) {
    const emailExist = await this.usersService.userRepository.findOne({where: { email: data.email}});
      if ((emailExist == null) || (emailExist.id == data.id)) {
        const user = this.usersService.userRepository.create();
        if(data?.email)
        data['email'] = data?.email.toLowerCase()
        Object.assign(user, data);
        return this.usersService.userRepository.save(user, { reload: true });
    } else {
      throw new BadRequestException('The email is already used');
    }
  }
  @Roles(Role.Admin)
  @Post()
  @ApiBody({ type : createAndUpdateUsers })
  @ApiCreatedResponse({
    description: '',
    type: createAndUpdateUsers,
  })
  async addUser(@Body() data: any) {
    const emailExist = await this.usersService.userRepository.findOne({where: { email: data.email}});
    if (emailExist == null) {
      const user = this.usersService.userRepository.create();
      if(data?.email)
      data['email'] = data?.email.toLowerCase()
      Object.assign(user, data);
      await this.usersService.userRepository.save(user, { reload: true });
      return user;
    } else {
      throw new BadRequestException('User already exist');
    }
  
  }
  @Roles(Role.Admin)
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.userRepository.delete(id);
  }
  @Roles(Role.Admin)
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
