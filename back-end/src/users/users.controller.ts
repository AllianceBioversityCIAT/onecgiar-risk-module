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
import * as XLSX from 'xlsx-js-style';
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
import { Brackets, In } from 'typeorm';
import { createAndUpdateUsers, exportToExcel, getUsers } from 'DTO/users.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
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
    if (query.search == 'teamMember') {
      return this.usersService.userRepository
        .createQueryBuilder('users')
        .where('users.full_name like :full_name', {
          full_name: `%${query.full_name}%`,
        })
        .orWhere('users.email like :email', { email: `%${query.email}%` })
        .select([
          'users.id as id',
          'users.full_name as full_name',
          'users.email as email',
        ])
        .getRawMany();
    } else {
      const take = query.limit || 10;
      const skip = (Number(query.page || 1) - 1) * take;
      let ids = await this.usersService.userRepository
        .createQueryBuilder('users')
        .where('users.role = :role', {role: query?.role ? query?.role : 0})
        .andWhere(
          new Brackets((qb) => {
            qb.where('users.full_name like :full_name', {
              full_name: `%${query.email || ''}%`,
            }).orWhere('users.email like :email', { email: `%${query.email || ''}%` });
          }),
        )
        .orderBy(this.sort(query))
        .skip(skip || 0)
        .take(take || 10)

        const finalResult = await ids.getManyAndCount();
        return {
          result: finalResult[0],
          count: finalResult[1],
        };
    }
  }
  @Roles()
  @Put()
  @ApiBody({ type: createAndUpdateUsers })
  @ApiCreatedResponse({
    description: '',
    type: createAndUpdateUsers,
  })
  async updateUser(@Body() data: any) {
    const emailExist = await this.usersService.userRepository.findOne({
      where: { email: data.email },
    });
    if (emailExist == null || emailExist.id == data.id) {
      const user = this.usersService.userRepository.create();
      if (data?.email) data['email'] = data?.email.toLowerCase();
      Object.assign(user, data);
      return this.usersService.userRepository.save(user, { reload: true });
    } else {
      throw new BadRequestException('The email is already used');
    }
  }
  @Roles()
  @Post()
  @ApiBody({ type: createAndUpdateUsers })
  @ApiCreatedResponse({
    description: '',
    type: createAndUpdateUsers,
  })
  async addUser(@Body() data: any) {
    const emailExist = await this.usersService.userRepository.findOne({
      where: { email: data.email },
    });
    if (emailExist == null) {
      const user = this.usersService.userRepository.create();
      if (data?.email) data['email'] = data?.email.toLowerCase();
      Object.assign(user, data);
      await this.usersService.userRepository.save(user, { reload: true });
      return user;
    } else {
      throw new BadRequestException('User already exist');
    }
  }
  @Roles()
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.userRepository.delete(id);
  }
  @Roles()
  @Get('export/all')
  @ApiCreatedResponse({
    description: '',
    type: exportToExcel,
  })
  async export(@Query() query:any) {
    let users = await this.usersService.userRepository
    .createQueryBuilder('users')
    .where('users.full_name like :full_name', {
      full_name: `%${query.email}%`,
    })
    .orWhere('users.email like :email', { email: `%${query.email}%` })
    .select('users.id as id')
    .getRawMany();
    
    const result =
    await this.usersService.userRepository.find({
      where: {
        id: users.length ? In(users.map(d=>d.id)) : null,
        role: query?.role ? query?.role : null,
      },
      order: { ...this.sort(query) },
    });

    const file_name = 'All-Users.xlsx';
    var wb = XLSX.utils.book_new();

    const finaldata  = this.prepareData(result);

    const ws = XLSX.utils.json_to_sheet(finaldata);

    this.appendStyleForXlsx(ws);

    this.autofitColumnsXlsx(finaldata,ws);

    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    await XLSX.writeFile(wb, join(process.cwd(), 'generated_files', file_name), { cellStyles: true });
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

    getTemplate() {
    return {
      ID: null,
      'First Name': null,
      'Last Name': null,
      Email: null,
      Role: null,
      'Full Name': null
    };
  }

  mapTemplate(template, element) {
    template.ID = element.id;
    template['First Name'] = element.first_name;
    template['Last Name'] = element.last_name;
    template.Email = element.email;
    template.Role = element.role;
    template['Full Name'] = element.full_name;

  }


  prepareData(users) {
    let finaldata = [this.getTemplate()];

    users.forEach((element) => {
      const template = this.getTemplate();
      this.mapTemplate(template, element);
      finaldata.push(template);
    });

    finaldata = finaldata.filter(d => d.ID != null);
    
    return finaldata;
  }


  appendStyleForXlsx(ws: XLSX.WorkSheet) {
    const range = XLSX.utils.decode_range(ws["!ref"] ?? "");
    const rowCount = range.e.r;
    const columnCount = range.e.c;

    for (let row = 0; row <= rowCount; row++) {
      for (let col = 0; col <= columnCount; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        // Add center alignment to every cell
        
        ws[cellRef].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true,
          },
        };


        if (row === 0) {
          // Format headers and names
          ws[cellRef].s = {
            ...ws[cellRef].s,
            fill: { fgColor: { rgb: '436280' } },
            font: { color: { rgb: 'ffffff' } ,  bold: true },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
          };
        }
      }
    }
  }


  autofitColumnsXlsx(json: any[], worksheet: XLSX.WorkSheet, header?: string[]) {

    const jsonKeys = header ? header : Object.keys(json[0]);

    let objectMaxLength = []; 
    for (let i = 0; i < json.length; i++) {
      let objValue = json[i];
      for (let j = 0; j < jsonKeys.length; j++) {
        if (typeof objValue[jsonKeys[j]] == "number") {
          objectMaxLength[j] = 10;
        } else {

          const l = objValue[jsonKeys[j]] ? objValue[jsonKeys[j]].length : 0;

          objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l + 5;
        }
      }

      let key = jsonKeys;
      for (let j = 0; j < key.length; j++) {
        objectMaxLength[j] =
          objectMaxLength[j] >= key[j].length
            ? objectMaxLength[j]
            : key[j].length + 1;
      }
    }

    const wscols = objectMaxLength.map(w => { return { width: w} });

    //row height
    worksheet['!rows'] = [];
    for(let i = 0 ; i < json.length + 1; i++) {
       worksheet['!rows'].push({
        hpt: 100
       })
    }

    worksheet["!cols"] = wscols;
  }
}
