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
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';

@ApiTags('Emails')
@Controller('emails')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
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
  @Roles()
  @Get('')
  @ApiCreatedResponse({
    description: '',
    type: getEmailsDto,
  })
  async getEmailLogs(@Query() query: any) {
    let status :any = 'All';
    if(query?.status == 'true') {
      status = true;
    }
    else if(query?.status == 'false'){
      status = false;
    }
    const take = query.limit || 10
    const skip=(Number(query.page)-1)*take;
      let result = await this.emailService.repo.createQueryBuilder('email');
      if(status != 'All') {
        result.where('status = :status', { status: status })
      }
      result.andWhere(new Brackets(qb => {
        qb.where("email LIKE :email", { email: (`%${query?.search || ''}%`) })
        .orWhere("name LIKE :name", { name: (`%${query?.search || ''}%`) });                                 
      })) 
      .orderBy(this.sort(query))
      .skip(skip || 0)
      .take(take || 10)

      const finalResult = await result.getManyAndCount();
      return {
        result : finalResult[0],
        count: finalResult[1]
      }
  }
  @ApiBearerAuth()
  @Roles()
  @Get('test/test')
  async test() {

    const email1 = await this.emailService.sendEmailTobyVarabel(1,1)

    return email1;
  }
}
