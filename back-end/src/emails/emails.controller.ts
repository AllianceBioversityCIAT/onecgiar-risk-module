import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { EmailsService } from './emails.service';
import { filterStatusReq, getEmailsDto } from 'DTO/emails.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { Brackets, ILike, Like } from 'typeorm';

@ApiTags('emails')
@Controller('emails')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailsController {
  constructor(private emailService: EmailsService) {}
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'ASC' };
  }
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('')
  @ApiCreatedResponse({
    description: '',
    type: getEmailsDto,
  })
  async getEmailLogs(@Query() query) {
    console.log(query?.status)
    let status :any = '';
    if(query?.status == 'true') {
      status = true;
    }
    else if(query?.status == 'false'){
      status = false;
    }
    const take = query.limit || 10
    const skip=(Number(query.page)-1)*take;
    if(query.status != 'All') {
      let [result, total] = await this.emailService.repo.createQueryBuilder('email')
      .where('status = :status', { status: status })
      .andWhere(new Brackets(qb => {
        qb.where("email LIKE :email", { email: (`%${query?.search || ''}%`) })
        .orWhere("name LIKE :name", { name: (`%${query?.search || ''}%`) });                                 
      })) 
      .orderBy(this.sort(query))
      .skip(skip || 0)
      .take(take || 10)
      .getManyAndCount();
      return {
        result : result,
        count: total
      } 
    }
    else {
      let [result, total] = await this.emailService.repo.createQueryBuilder('email')
      .where(new Brackets(qb => {
        qb.where("email LIKE :email", { email: (`%${query?.search || ''}%`) })
        .orWhere("name LIKE :name", { name: (`%${query?.search || ''}%`) });                                 
      })) 
      .orderBy(this.sort(query))
      .skip(skip || 0)
      .take(take || 10)
      .getManyAndCount();
      return {
        result : result,
        count: total
      } 
      
    }

  }
  // getEmailLogs(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  // ) {
  //   limit = limit > 100 ? 100 : limit;
  //   return this.emailService.emailLogsPaginate({
  //     page,
  //     limit,
  //     route: '',
  //   });
  // }
  @Roles(Role.Admin)
  @Get('test/test')
  async test() {

    const email1 = await this.emailService.sendEmailTobyVarabel(1,1)

    return email1;
  }
  

  // @ApiBearerAuth()
  // @Roles(Role.Admin)
  // @Get('filter-search')
  // async filterEmailLogsTable(@Query('search') search: string) {
  //   return this.emailService.filterSearchEmailLogs(search);
  // }

  // @ApiBearerAuth()
  // @ApiParam({ name: 'status' , type: filterStatusReq})
  // @Roles(Role.Admin)
  // @Get('filter-status')
  // async filterStatusLogsTable(@Query('status') status: any) {
  //   if (status == 'false') {
  //     return this.emailService.getEmailsByStatus(false);
  //   } else if(status == 'true'){
  //     return this.emailService.getEmailsByStatus(true);
  //   }
  //   else {
  //     return this.emailService.getEmailsByStatus(null);
  //   }
  // }
}
