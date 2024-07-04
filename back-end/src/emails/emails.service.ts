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
import { CollectedEmail } from 'entities/collected-emails.entity';
@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email) public repo: Repository<Email>,
    @InjectRepository(CollectedEmail) public collectedEmails: Repository<CollectedEmail>,
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
        .andWhere(`e.variable_id != ${1}`)
        .andWhere(`e.variable_id != ${6}`)
        .getMany();
      return emaillogs;
    }
  }
  async send(email: Email) {
    this.logger.log('Email Notifications send =>'+email.id);
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
    if (emails.length <= 200) for (let email of emails) await this.send(email);
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'email-notifications-announcement',
  })
  private async sendEmailNotificationsForAnnouncement() {
    let emails = await this.getAnnouncementEmails();
    if (emails.length <= 200) for (let email of emails) await this.send(email);
  }


  @Cron(CronExpression.EVERY_DAY_AT_10PM, {
    name: 'email-notifications-for-risk-changes',
  })
  private async sendEmailNotificationsForRiskChanges() { 
    this.logger.log('Email Notifications For Risk Changes');
    await this.getEmailsByVariable(1);

    let emails = await this.getEmailsByStatusAndVariableId(false, 1);

    if (emails.length <= 200) for (let email of emails) await this.send(email);
  } 

  async getAnnouncementEmails() {
    let emaillogs = await this.repo
    .find({
      where: {
        status: false,
        variable_id: IsNull()
      }
    });
    return emaillogs;
}
  async getEmailsByStatusAndVariableId(status: boolean, variableId) {
      let emaillogs = await this.repo
      .find({
        where: {
          status: status,
          variable_id: variableId
        }
      });
      return emaillogs;
  }

  async getEmailsByVariable(variableId) {
    const content = await this.variabelService.variablesRepository.findOne({
      where: { id: variableId },
    });

    const emails = await this.collectedEmails.find({
      where: {
        variable_id: variableId,
        status: false
      },
      relations: ['initiative', 'risk']
    });

    let userEmail = emails.map(d => d.email);
    userEmail = [...new Set(userEmail)];

    let emailsForEachUser = [];
    userEmail.forEach(async userEmail => {
      emailsForEachUser = emails.filter(d => d.email == userEmail);

      const newEmail = await this.repo.create({
        name: emailsForEachUser[0].name,
        email: emailsForEachUser[0].email,
        subject: emailsForEachUser[0].subject,
        emailBody: this.testTemplate(emailsForEachUser[0].name, emailsForEachUser , content.value),
        variable_id: content.id
      });


      return await this.repo.save(newEmail)
      .then(async (data) => {
        for(let email of emails) {
          this.collectedEmails.update(email.id, { status: true });
        }
      }, (error) => {
        console.log('error => ', error)
      });
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
    await this.getEmailsByVariable(6);
    let emails = await this.getEmailsByStatusAndVariableId(false, 6);
    if (emails.length <= 200) for (let email of emails) await this.send(email);
  }

  async createEmail(
    name: string,
    subject: string,
    email: string,
    body: string,
    variable_id
  ) {
    const newEmail = await this.repo.create({
      name,
      email,
      subject,
      emailBody: body,
      variable_id
    });

    return await this.repo.save(newEmail);
  }
  async createCollectedEmails(
    name: string,
    subject: string,
    email: string,
    risk: any,
    init: any,
    variableId: number
  ) {

    const newEmail = await this.collectedEmails.create({
      name,
      email,
      subject,
      risk_id: risk.id,
      init_id: init.id,
      variable_id: variableId
    });
    return await this.collectedEmails.save(newEmail);
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

  testTemplate(name, data: any[], contentLabel) {
    let content = `<div style="height: 800px; background-color: #f7f7f7">
    <div style="height: 150px; background-color: rgb(67, 98, 128)">
        <img width="50" alt="CGIAR" style="margin: 30px; margin-bottom:0px" src="https://www.cgiar.org/wp/wp-content/themes/cgiar/assets/images/logo_white-9a4b0e50b1.png">
        <h2 style="margin: 0px; height: 48px; display: inline; position: absolute;color: white;top: 46px;"><b>CGIAR</b> Risk Management</h2>
        <div style="height: 60px; width: 70%; margin: auto; background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <h2 style="color: rgb(67, 98, 128); letter-spacing: 2px; margin: 0 auto;text-align: center; margin-top: 15px; border-bottom: 1px solid #ebeae8; width: 70%; padding: 11px;">Notification</h2>
        </div>
    </div>
    <div style="width: 70%; margin: auto; background-color: #fff; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <div style="margin-top: 50px; width: 85%; padding-bottom: 30px;">`; 
    

    content += `
    Dear ${name}
    <br>
    ${contentLabel}




    <table style="width:100% ; border:1px solid gray !important; text-align: center; border-collapse: collapse;">
    <tr>
      <th style="border:1px solid gray !important; border-collapse: collapse;">Risk Id</th>
      <th style="border:1px solid gray !important; border-collapse: collapse;">Risk Name</th>
      <th style="border:1px solid gray !important; border-collapse: collapse;">Link</th>

    </tr>
    `

    for(let d of data) {
    content += `
    <tr>
      <td style="border:1px solid gray !important; border-collapse: collapse;">${d.risk.id}</td>
      <td style="border:1px solid gray !important; border-collapse: collapse;">${d.risk.title}</td>
      <td style="border:1px solid gray !important; border-collapse: collapse;">
          <a style="color: rgb(67, 98, 128); text-align: left;" traget="_blank" href="${process.env.FRONTEND}/home/${d.initiative.id}/${d.initiative.official_code}">${process.env.FRONTEND}/home/${d.initiative.id}/${d.initiative.official_code}</a>
      </td>
      </tr>
      `
    }

    content += `
            </table>
          </div>
        </td>
      </tr>
    </table>
  </div>
    `
    
    return content
  }




  emailTemplate(body: string) {
    return `
    
    <div style="height: 800px; background-color: #f7f7f7">
    <div style="height: 150px; background-color: rgb(67, 98, 128)">
        <img width="50" alt="CGIAR" style="margin: 30px; margin-bottom:0px" src="https://www.cgiar.org/wp/wp-content/themes/cgiar/assets/images/logo_white-9a4b0e50b1.png">
        <h2 style="margin: 0px; height: 48px; display: inline; position: absolute;color: white;top: 46px;"><b>CGIAR</b> Risk Management</h2>
        <div style="height: 60px; width: 70%; margin: auto; background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <h2 style="color: rgb(67, 98, 128); letter-spacing: 2px; margin: 0 auto;text-align: center; margin-top: 15px; border-bottom: 1px solid #ebeae8; width: 70%; padding: 11px;">Notification</h2>
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
    const email1 = await this.createEmail(name, subject, email, emailBody, null);

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
        if (content_id == 5 || content_id == 6) {
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
      let email1;
      if(content_id != 1 && content_id != 6) {
        email1 = await this.createEmail(name, subject, email, emailBody, content_id);
      } else {
        email1 = await this.createCollectedEmails(name, subject, email, risk, init, content_id);
      }

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
