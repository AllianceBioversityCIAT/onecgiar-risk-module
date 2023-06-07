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
    const body = `
        <p style="font-weight: 200">
        Dear, ${'fullName'}
        <br>
        This is a new notify you.
        </p>
        <br>
        <br>
        <a style="color: rgb(107, 151, 237)" traget="_blank" href="${'http://localhost:4200'}/request/view/${1}">${process.env.FRONTEND}/request/view/${1}</a>
    `;
    const emailBody = this.emailTemplate(body);
    const email1 = await this.emailService.createEmail(
        'Moayad',
        'moayad@codeobia.com',
        emailBody
      );

      return email1;
  }

  emailTemplate(body: string) {
    return `

<div style="height: 800px; background-color: #f7f7f7">
<div style="height: 150px; background-color: rgb(107, 151, 237)">
    <img width="50" alt="SHL" style="margin: 30px; margin-bottom:0px" src="https://www.cgiar.org/wp/wp-content/themes/cgiar/assets/images/logo_white-9a4b0e50b1.png">
    <div style="margin: 0px; height: 90px; display: inline-block; width: 42%"></div>
    <div style="height: 60px; width: 70%; margin: auto; background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
        <h2 style="color: rgb(107, 151, 237); letter-spacing: 2px; margin: 0 auto;text-align: center; margin-top: 15px; border-bottom: 1px solid #ebeae8; width: 70%; padding: 11px;">NOTIFY</h2>
    </div>
</div>
<div style="width: 70%; margin: auto; background-color: #fff; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td align="center">
            <div style="margin-top: 50px; width: 85%; padding-bottom: 30px;">
            ${body}
            </div>
        </td>
    </tr>
    </table>
</div>
        `;
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
