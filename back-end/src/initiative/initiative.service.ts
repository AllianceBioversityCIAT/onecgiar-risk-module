import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { Risk } from 'entities/risk.entity';
import { User } from 'entities/user.entitiy';
import { firstValueFrom, map } from 'rxjs';
import { EmailsService } from 'src/emails/emails.service';
import { RiskService } from 'src/risk/risk.service';
import { UsersService } from 'src/users/users.service';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class InitiativeService {
  constructor(
    @InjectRepository(Initiative)
    public iniRepository: Repository<Initiative>,
    @InjectRepository(InitiativeRoles)
    public iniRolesRepository: Repository<InitiativeRoles>,
    private http: HttpService,
    private riskService: RiskService,
    private userService: UsersService,
    private emailsService: EmailsService,
  ) {}

  private readonly logger = new Logger(InitiativeService.name);
  clarisa_auth() {
    return {
      username: process.env.CLARISA_USERNAME,
      password: process.env.CLARISA_PASSWORD,
    };
  }
  async deleteRole(initiative_id, id) {
    const roles = await this.iniRolesRepository.findOne({
      where: { initiative_id, id },
    });
    if (roles) return await this.iniRolesRepository.remove(roles);
    else throw new NotFoundException();
  }

  async updateInitiativeUpdateDateToNow(initiative_id) {
    await this.iniRepository.update(initiative_id, {
      last_updated_date: new Date(),
    });
  }
  async updateRoles(initiative_id, id, initiativeRoles: InitiativeRoles) {
    const found_roles = await this.iniRolesRepository.findOne({
      where: { initiative_id, id },
    });
    if (found_roles) return await this.iniRolesRepository.save(initiativeRoles);
    else throw new NotFoundException();
  }

  async createINIT(old_init_id: number, reason, user, top: Risk[]) {
    const old_initiative = await this.iniRepository.findOne({
      where: { id: old_init_id },
      relations: ['roles', 'roles.user'],
    });
    let num = 1;
    if (top.length)
      for (const risk of top) {
        risk.top = num++;
        await this.riskService.updateRisk(risk.id, risk, user);
      }

    const initiative = this.iniRepository.create();
    initiative.clarisa_id = old_initiative.clarisa_id;
    initiative.name = old_initiative.name;
    initiative.official_code = old_initiative.official_code;
    initiative.parent_id = old_init_id;
    initiative.created_by_user_id = user.id;
    initiative.publish_reason = reason;
    const new_init = await this.iniRepository.save(initiative, {
      reload: true,
    });

    const old_Risks = await this.riskService.riskRepository.find({
      where: { initiative_id: old_init_id },
      relations: ['mitigations', 'mitigations.status'],
    });
    if (old_Risks.length)
      for (let risk of old_Risks) {
        delete risk.id;
        delete risk.current_level;
        delete risk.target_level;
        delete risk.flag;

        if (risk?.mitigations)
          risk.mitigations.forEach((mitigation) => {
            delete mitigation.id;
          });

        risk.initiative_id = new_init.id;
        await this.riskService.createRisk(risk);
      }
    let date = new Date();
    await this.iniRepository.update(old_init_id, { last_updated_date: date });
    await this.iniRepository.update(new_init.id, { submit_date: date });
    if (old_initiative?.roles)
      old_initiative.roles.forEach((role) => {
        if (
          role?.user &&
          (role.role == 'Leader' || role.role == 'Coordinators')
        )
          this.emailsService.sendEmailTobyVarabel(role?.user, 3, 4);
      });
    let admins = await this.userService.userRepository.find({
      where: { role: 'admin' },
    });
    admins.forEach((user: User) => {
      this.emailsService.sendEmailTobyVarabel(user, 3, 4);
    });
    return await this.iniRepository.findOne({
      where: { id: new_init.id },
      relations: ['risks'],
    });
  }

  async setRole(initiative_id, role: InitiativeRoles) {
    let init = await this.iniRepository.findOne({
      where: { id: initiative_id },
      relations: ['roles'],
    });
    if (!init) throw new NotFoundException();
    const newRole = {
      initiative_id: initiative_id,
      user_id: role.user_id,
      email: role.email.toLowerCase(),
      role: role.role,
    };

    return await this.iniRolesRepository.save(newRole, { reload: true });
  }
  async syncFromClarisa() {
    try {
      const clarisa_initiatives = await firstValueFrom(
        this.http
          .get(`${process.env.CLARISA_URL}/api/allInitiatives`, {
            auth: this.clarisa_auth(),
          })
          .pipe(map((d) => d.data)),
      );

      for (const clarisa_initiative of clarisa_initiatives) {
        let initiative;
        initiative = await this.iniRepository.findOne({
          where: { clarisa_id: clarisa_initiative.id },
        });
        if (!initiative) {
          initiative = this.iniRepository.create();
          initiative.clarisa_id = clarisa_initiative.id;
        }
        initiative.name = clarisa_initiative.name;
        initiative.official_code = clarisa_initiative.official_code;

        await this.iniRepository.save(initiative);
      }
      this.logger.log('Sync CLARISA initiative Data ');
    } catch (e) {
      this.logger.error('Error in Sync CLARISA initiative Data ', e);
    }
  }
  @Cron(CronExpression.EVERY_HOUR)
  syncClarisa() {
    this.syncFromClarisa();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  syncUserRolesTask() {
    this.syncUserRoles();
  }
  @Cron(CronExpression.EVERY_10_SECONDS)
  async filterStatus() {
    this.logger.log('filterStatus is runing');
    const allInit = await this.iniRepository.find({
      where: { parent_id: IsNull() },
      order: { id: 'DESC' },
    });

    for(let init of allInit){
      const lastVersion = await this.iniRepository.findOne({
        where: { parent_id: init.id },
        relations: ['risks'],
        order: { id: 'DESC', risks: { id: 'DESC', top: 'ASC' } }
      })
      if(lastVersion != null) {
        if (new Date(init.last_updated_date).valueOf() == new Date(lastVersion.submit_date).valueOf()) {
          this.iniRepository
            .createQueryBuilder()
            .update(Initiative)
            .set({
              status: true,
              last_updated_date: init.last_updated_date,
            })
            .where(`id = ${init.id}`)
            .execute();
        }
        else if(init.status == true) {
          if(new Date(init.last_updated_date).valueOf() != new Date(lastVersion.submit_date).valueOf()) {
            this.iniRepository
            .createQueryBuilder()
            .update(Initiative)
            .set({
              status: false,
              last_updated_date: new Date()
            })
            .where(`id = ${init.id}`)
            .execute();
          }
        }
      }
    }
   this.logger.log('filterStatus is finish');
  }

  async syncUserRoles() {
    try {
      const user_roles = await this.iniRolesRepository.find({
        where: { user_id: IsNull() },
      });
      const users = await this.userService.userRepository.find();
      for (let user_role of user_roles) {
        let found_users = users.filter((u) => u.email == user_role.email);
        if (found_users.length) {
          user_role.user_id = found_users[0].id;
          // To the user that was added by the Admin or Leader/Coordinator
          this.emailsService.sendEmailTobyVarabel(found_users[0], 7, 8);

          await this.iniRolesRepository.save(user_role);
        }
      }
      this.logger.log('Sync Users Roles');
    } catch (e) {
      this.logger.error('Error in Sync CLARISA initiative Data ', e);
    }
  }
}
