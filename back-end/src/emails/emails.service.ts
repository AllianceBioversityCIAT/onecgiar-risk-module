import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { Email } from './email.entity';
import * as sgMail from '@sendgrid/mail';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VariablesService } from 'src/variables/variables.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email) private repo: Repository<Email>,
    private variabelService: VariablesService,
    private usersService: UsersService,
  ) {}
  private readonly logger = new Logger(EmailsService.name);
  async sendEmailWithSendGrid(to, subject, html) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from: process.env.DEFAULT_EMAIL, //default Use the email address or domain you verified above
      subject,
      text: html.replace(/(<([^>]+)>)/gi, ''),
      html,
    };
    return await sgMail.send(msg).catch((e) => false);
  }
  async getEmailsByStatus(status: boolean) {
    // return await this.repo.find({ where: { status } });
    var emaillogs = await this.repo
      .createQueryBuilder('e')
      .where({ status: Boolean(status) })
      .getMany();
    return emaillogs;
  }
  async send(email: Email) {
    if (Boolean(parseInt(process.env.CAN_SEND_EMAILS))) {
      let sendGridStatus = await this.sendEmailWithSendGrid(
        email.email,
        email.name,
        email.emailBody,
      );
      if (sendGridStatus) this.repo.update(email.id, { status: true });
    } else {
      this.repo.update(email.id, { status: true });
    }
  }
  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'email-notifications',
  })
  private async sendEmailNotifications() {
    this.logger.log('Email Notifications Runing');
    let emails = await this.getEmailsByStatus(false);
    if (emails.length <= 10)
      emails.forEach(async (email) => {
        await this.send(email);
      });
  }

  async createEmail(
    name: string,
    subject: string,
    email: string,
    body: string,
  ) {
    const newEmail = await this.repo.create({
      name,
      email,
      subject,
      emailBody: body,
    });

    return await this.repo.save(newEmail);
  }
  async emailLogsPaginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Email>> {
    const queryBuilder = this.repo.createQueryBuilder('e');
    queryBuilder.orderBy('e.id', 'DESC');
    return paginate<Email>(queryBuilder, options);
  }
  async filterSearchEmailLogs(search: string) {
    var emaillogs = await this.repo
      .createQueryBuilder('emaillog')
      .where({ email: Like(`%${search}%`) })
      .orWhere({ id: Like(`%${search}%`) })
      .orWhere({ name: Like(`%${search}%`) })
      .getMany();
    return emaillogs;
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

  async test(name, email, subject) {
    const body = `
            <p style="font-weight: 200">
            Dear, ${'fullName'}
            <br>
            This is a new notify you.
            </p>
            <br>
            <br>
            <a style="color: rgb(107, 151, 237)" traget="_blank" href="${'http://localhost:4200'}/request/view/${1}">${
      process.env.FRONTEND
    }/request/view/${1}</a>
        `;
    const emailBody = this.emailTemplate(body);
    const email1 = await this.createEmail(name, subject, email, emailBody);

    return email1;
  }

  async createEmailBy(name, email, subject, contnet) {
    const body = `
            <p style="font-weight: 200">
            Dear, ${name}
            <br>
            ${contnet}
            </p>
            <br>
            <br>
        `;
    const emailBody = this.emailTemplate(body);
    const email1 = await this.createEmail(name, subject, email, emailBody);

    return email1;
  }

  async sendEmailTobyVarabel(user, subject_varabel_id, content_varabel_id) {
    const subject = await this.variabelService.variablesRepository.findOne({
      where: { id: subject_varabel_id },
    });
    const content = await this.variabelService.variablesRepository.findOne({
      where: { id: content_varabel_id },
    });

    return await this.createEmailBy(
      user.full_name,
      user.email,
      subject.value,
      content.value,
    );
  }
}
