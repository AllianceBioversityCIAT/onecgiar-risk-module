import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailsService } from './emails.service';

@ApiTags('emails')
@Controller('emails')
export class EmailsController {
  constructor(private emailService: EmailsService) {}

  @ApiBearerAuth()
  @Get('')
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

  @Get('test/test')
  async test() {

    const email1 = await this.emailService.sendEmailTobyVarabel(1,1,2)

    return email1;
  }
  

  @ApiBearerAuth()
  @Get('filter-search')
  async filterEmailLogsTable(@Query('search') search: string) {
    return this.emailService.filterSearchEmailLogs(search);
  }

  @ApiBearerAuth()
  @Get('filter-status')
  async filterStatusLogsTable(@Query('status') status: any) {
    if (status == 'false') {
      return this.emailService.getEmailsByStatus(false);
    } else {
      return this.emailService.getEmailsByStatus(true);
    }
  }
}
