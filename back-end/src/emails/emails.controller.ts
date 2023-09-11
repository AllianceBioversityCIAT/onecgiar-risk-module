import {
  Controller,
  DefaultValuePipe,
  Get,
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

@ApiTags('emails')
@Controller('emails')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailsController {
  constructor(private emailService: EmailsService) {}

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('')
  @ApiCreatedResponse({
    description: '',
    type: getEmailsDto,
  })
  getEmailLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.emailService.emailLogsPaginate({
      page,
      limit,
      route: '',
    });
  }
  @Roles(Role.Admin)
  @Get('test/test')
  async test() {

    const email1 = await this.emailService.sendEmailTobyVarabel(1,1)

    return email1;
  }
  

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('filter-search')
  async filterEmailLogsTable(@Query('search') search: string) {
    return this.emailService.filterSearchEmailLogs(search);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'status' , type: filterStatusReq})
  @Roles(Role.Admin)
  @Get('filter-status')
  async filterStatusLogsTable(@Query('status') status: any) {
    if (status == 'false') {
      return this.emailService.getEmailsByStatus(false);
    } else {
      return this.emailService.getEmailsByStatus(true);
    }
  }
}
