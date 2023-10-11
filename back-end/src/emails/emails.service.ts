import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { IsNull, LessThanOrEqual, Like, Repository } from 'typeorm';
import { Email } from './email.entity';
import * as sgMail from '@sendgrid/mail';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VariablesService } from 'src/variables/variables.service';
import { UsersService } from 'src/users/users.service';
import { InitiativeService } from 'src/initiative/initiative.service';
import { Initiative } from 'entities/initiative.entity';
import { Risk } from 'entities/risk.entity';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email) public repo: Repository<Email>,
    private variabelService: VariablesService,
    private usersService: UsersService,
    @InjectRepository(Initiative)
    public iniRepository: Repository<Initiative>,
    @InjectRepository(Risk)
    public riskRepository: Repository<Risk>,
    @InjectRepository(InitiativeRoles)
    public initRoleRepository: Repository<InitiativeRoles>,
  ) {}
  private readonly logger = new Logger(EmailsService.name);
  async sendEmailWithSendGrid(to, subject, html) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from: {
        email: process.env.DEFAULT_EMAIL,
        name: 'CGIAR Risk Management',
      }, //default Use the email address or domain you verified above
      subject,
      text: html.replace(/(<([^>]+)>)/gi, ''),
      html,
    };
    return await sgMail.send(msg).catch((e) => false);
  }
  async getEmailsByStatus(status: boolean) {
    // return await this.repo.find({ where: { status } });
    if (status == null) {
      var emaillogs = await this.repo.createQueryBuilder('e').getMany();
      return emaillogs;
    } else {
      var emaillogs = await this.repo
        .createQueryBuilder('e')
        .where({ status: Boolean(status) })
        .getMany();
      return emaillogs;
    }
  }
  async send(email: Email) {
    if (Boolean(parseInt(process.env.CAN_SEND_EMAILS))) {
      let sendGridStatus = await this.sendEmailWithSendGrid(
        email.email,
        email.subject,
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

  @Cron(CronExpression.EVERY_DAY_AT_10AM, {
    name: 'Due-Date-notifications',
  })
  private async dueDateNotifications() {
    this.logger.log('Due-Date-notifications Runing');

    let date = new Date();
    let a = date.getFullYear();
    let b = date.getMonth() + 1;
    let c = date.getDate();

    const currentDate = a + '-' + b + '-' + c;

    const risks = await this.riskRepository.find({
      where: {
        due_date: currentDate,
        original_risk_id: IsNull(),
      },
    });

    for (let risk of risks) {
      const init = await this.initRoleRepository.find({
        where: {
          initiative_id: risk.initiative_id,
        },
        relations: ['user'],
      });

      init.forEach((init) => {
        if (init.role == 'Leader' || init.role == 'Coordinator') {
          this.sendEmailTobyVarabel(init.user, 6, init.initiative_id, risk);
        }
      });
    }
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
    <div style="height: 150px; background-color: rgb(67, 98, 128)">
        <img width="50" alt="CGIAR" style="margin: 30px; margin-bottom:0px" src="https://www.cgiar.org/wp/wp-content/themes/cgiar/assets/images/logo_white-9a4b0e50b1.png">
        <h2 style="margin: 0px; height: 48px; display: inline; position: absolute;color: white;top: 46px;"><b>CGIAR</b> Risk Management</h2>
        <div style="height: 60px; width: 70%; margin: auto; background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <h2 style="color: rgb(67, 98, 128); letter-spacing: 2px; margin: 0 auto;text-align: center; margin-top: 15px; border-bottom: 1px solid #ebeae8; width: 70%; padding: 11px;">NOTIFY</h2>
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
            Dear ${'fullName'}
            <br>
            This is a new notify you.
            </p>
            <br>
            <br>
            <a style="color: rgb(67, 98, 128)" traget="_blank" href="${
              process.env.FRONTEND
            }/request/view/${1}">${process.env.FRONTEND}/request/view/${1}</a>
        `;
    const emailBody = this.emailTemplate(body);
    const email1 = await this.createEmail(name, subject, email, emailBody);

    return email1;
  }

  async createEmailBy(
    name,
    email,
    subject,
    contnet,
    init_id,
    risk,
    content_id,
  ) {
    const init = await this.iniRepository.findOne({
      where: {
        id: init_id,
      },
    });
    let body = `<p style="font-weight: 200"> Dear ${name}<br>${contnet}</p>`;
    try {
      if (init_id != null && risk == null) {
        if (content_id == 10) {
          body = `
          <p style="font-weight: 200">
          Dear ${name}
          <br>
          ${contnet}
          <table style="width:100% ; border:1px solid gray !important; text-align: center; border-collapse: collapse;">
            <tr>
              <th style="border:1px solid gray !important; border-collapse: collapse;">INIT Code</th>
              <th style="border:1px solid gray !important; border-collapse: collapse;">Initiative name</th>
            </tr>
            <tr>
              <td style="border:1px solid gray !important; border-collapse: collapse;">${init.official_code}</td>
              <td style="border:1px solid gray !important; border-collapse: collapse;">${init.name}</td>
            </tr>
          </table>
          </p>
          <a style="color: rgb(67, 98, 128); text-align: left;" traget="_blank" href="${process.env.FRONTEND}/home">${process.env.FRONTEND}/home</a>
          <br>
          <br>
            `;
        } else {
          const lastVersion = await this.iniRepository.findOne({
            where: {
              id: init.last_version_id,
            },
          });
          let creationDate = lastVersion.submit_date
            .toISOString()
            .split('T')[0];
          body = `
          <p style="font-weight: 200">
          Dear ${name}
          <br>
          ${contnet}
          <table style="width:100% ; border:1px solid gray !important; text-align: center; border-collapse: collapse;">
            <tr>
              <th style="border:1px solid gray !important; border-collapse: collapse;">INIT Code</th>
              <th style="border:1px solid gray !important; border-collapse: collapse;">Initiative name</th>
              <th style="border:1px solid gray !important; border-collapse: collapse;">Version ID</th>
              <th style="border:1px solid gray !important; border-collapse: collapse;">Creation Date</th>
            </tr>
            <tr>
              <td style="border:1px solid gray !important; border-collapse: collapse;">${init.official_code}</td>
              <td style="border:1px solid gray !important; border-collapse: collapse;">${init.name}</td>
              <td style="border:1px solid gray !important; border-collapse: collapse;">${init.last_version_id}</td>
              <td style="border:1px solid gray !important; border-collapse: collapse;">${creationDate}</td>
            </tr>
          </table>
          </p>
          <a style="color: rgb(67, 98, 128); text-align: left;" traget="_blank" href="${process.env.FRONTEND}/home/${init.id}/${init.official_code}/versions/${init.last_version_id}">${process.env.FRONTEND}/home/${init.id}/${init.official_code}/versions/${init.last_version_id}</a>
          <br>
          <br>
            `;
        }
      } else {
        if (content_id == 5 || content_id == 1 || content_id == 6) {
          // console.log('wowo risk ==> ', risk)
          body = `
          <p style="font-weight: 200">
          Dear ${name}
          <br>
          ${contnet}
          <table style="width:100% ; border:1px solid gray !important; text-align: center; border-collapse: collapse;">
            <tr>
              <th style="border:1px solid gray !important; border-collapse: collapse;">Risk Id</th>
              <th style="border:1px solid gray !important; border-collapse: collapse;">Risk Name</th>
            </tr>
            <tr>
              <td style="border:1px solid gray !important; border-collapse: collapse;">${risk.id}</td>
              <td style="border:1px solid gray !important; border-collapse: collapse;">${risk.title}</td>
            </tr>
          </table>
          </p>
          <a style="color: rgb(67, 98, 128); text-align: left;" traget="_blank" href="${process.env.FRONTEND}/home/${init.id}/${init.official_code}">${process.env.FRONTEND}/home/${init.id}/${init.official_code}</a>
          <br>
          <br>
            `;
        }
      }

      const emailBody = this.emailTemplate(body);
      const email1 = await this.createEmail(name, subject, email, emailBody);

      return email1;
    } catch (error) {
      console.error(error);
    }
  }

  async sendEmailTobyVarabel(user, subject_varabel_id, initiative_id, risk) {
    const content = await this.variabelService.variablesRepository.findOne({
      where: { id: subject_varabel_id },
    });

    return await this.createEmailBy(
      user.full_name,
      user.email,
      content.label,
      content.value,
      initiative_id,
      risk,
      content.id,
    );
  }
}
