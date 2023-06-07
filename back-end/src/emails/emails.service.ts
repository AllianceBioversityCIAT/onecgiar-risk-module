import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { Email } from './email.entity';
import * as sgMail from '@sendgrid/mail';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class EmailsService {

    constructor(
        @InjectRepository(Email) private repo: Repository<Email>,
      ) {}

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
        .createQueryBuilder("e")
        .where({ status: Boolean(status)}) 
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
        console.log('email-notifications');
        let emails = await this.getEmailsByStatus(false);
        if (emails.length <= 10)
          emails.forEach(async (email) => {
            await this.send(email);
          });
      }

    async createEmail(name: string, email: string, body: string) {
        const newEmail = await this.repo.create({
          name:  name,
          email: email,
          emailBody: body
        }); 
        
        return await this.repo.save(newEmail); 
      }
      async emailLogsPaginate(options: IPaginationOptions): Promise<Pagination<Email>> {
        const queryBuilder = this.repo.createQueryBuilder('e');
        queryBuilder.orderBy('e.id', 'DESC')
          return paginate<Email>(queryBuilder, options);
      }
      async filterSearchEmailLogs(search: string) {
        var emaillogs = await this.repo
              .createQueryBuilder("emaillog")
              .where({ email: Like(`%${search}%`) }) 
              .orWhere({ id: Like(`%${search}%`) }) 
              .orWhere({ name: Like(`%${search}%`) }) 
              .getMany();
        return emaillogs;
      }

     
}
