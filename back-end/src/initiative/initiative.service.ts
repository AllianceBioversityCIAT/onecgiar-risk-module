import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionArea } from 'entities/action-area';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { Risk } from 'entities/risk.entity';
import { User } from 'entities/user.entitiy';
import { firstValueFrom, map } from 'rxjs';
import { EmailsService } from 'src/emails/emails.service';
import { RiskService } from 'src/risk/risk.service';
import { UsersService } from 'src/users/users.service';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { PhasesService } from 'src/phases/phases.service';
import { Archive } from 'entities/archive.entity';
@Injectable()
export class InitiativeService {
  constructor(
    @InjectRepository(Initiative)
    public iniRepository: Repository<Initiative>,
    @InjectRepository(InitiativeRoles)
    public iniRolesRepository: Repository<InitiativeRoles>,
    @InjectRepository(ActionArea)
    public actionAreaRepository: Repository<ActionArea>,
    @InjectRepository(Archive)
    public archiveRepository: Repository<Archive>,
    private http: HttpService,
    private riskService: RiskService,
    private userService: UsersService,
    private emailsService: EmailsService,
    public phaseService: PhasesService,
  ) {}
  roles(query, req) {
    if (query?.my_role) {
      if (Array.isArray(query?.my_role)) {
        return {
          roles: {
            user_id: req.user.id,
            role: In(query.my_role),
          },
        };
      } else
        return {
          roles: {
            user_id: req.user.id,
            role: query.my_role,
          },
        };
    } else if (query?.my_ini == 'true') {
      return { roles: { user_id: req.user.id } };
    } else return {};
  }

  filterCategory(query, title) {
    if (title == 'For Init') {
      if (query?.category) {
        if (Array.isArray(query?.category)) {
          return {
            category_id: In(query.category),
          };
        } else
          return {
            category_id: query.category,
          };
      } else return {};
    } else {
      if (query?.category) {
        if (Array.isArray(query?.category)) {
          return {
            id: In(query.category),
          };
        } else
          return {
            id: query.category,
          };
      } else return {};
    }
  }
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
  async updateRoles(initiative_id, id, initiativeRoles: any) {
    let userInInit: any;
    let emailIsInUsersEmail: any;

    const countOfleaders = await this.iniRolesRepository.findAndCount({
      where: {
        initiative_id: initiative_id,
        role: 'Leader',
        id: Not(initiativeRoles.id)
      },
    });

    if(initiativeRoles.user_id == null) {
      userInInit = await this.iniRolesRepository.findOne({
        where: { id: Not(initiativeRoles?.id), initiative_id: initiative_id, email: initiativeRoles.email },
      });

      emailIsInUsersEmail = await this.iniRolesRepository.findOne({
        where: { initiative_id: initiative_id, user: { email: initiativeRoles.email } },
        relations: ['user']
      });

      if(userInInit?.email == initiativeRoles?.email || initiativeRoles?.email == emailIsInUsersEmail?.user?.email) {
        throw new BadRequestException(
          `the user already has already the role in this initiative`,
        );
      }
    } else {
      userInInit = await this.iniRolesRepository.findOne({
        where: { id: Not(initiativeRoles?.id), initiative_id: initiative_id, user_id: initiativeRoles?.user_id?.id ? initiativeRoles?.user_id?.id : initiativeRoles?.user_id,},
      });
      if(userInInit != null) {
        throw new BadRequestException(
          `the user already has already the role in this initiative`,
        );
      }
    }

    // console.log('countOfleaders', countOfleaders)
    if (countOfleaders[1] >= 2 && initiativeRoles.role == 'Leader')
      throw new BadRequestException(
        `You can't add more than two leaders to the Initiative`,
      );

    const found_roles = await this.iniRolesRepository.findOne({
      where: { initiative_id, id },
    });
    if (found_roles) return await this.iniRolesRepository.save(initiativeRoles);
    else throw new NotFoundException();
  }

  async createINIT(old_init_id: number, user, top: Risk[]) {
    const old_initiative = await this.iniRepository.findOne({
      where: { id: old_init_id },
      relations: ['roles', 'roles.user'],
    });
    const allRisks = await this.riskService.riskRepository.find({
      where: { initiative_id: old_init_id },
    });
    //set default value
    for (const risks of allRisks) {
      risks.top = 999;
      await this.riskService.updateRisk(risks.id, risks, user, true);
    }
    let num = 1;
    if (top.length)
      for (const risk of top) {
        risk.top = num++;
        await this.riskService.updateRisk(risk.id, risk, user, true);
      }

    const phase = await this.phaseService.findActivePhase();

    const initiative = this.iniRepository.create();
    initiative.clarisa_id = old_initiative.clarisa_id;
    initiative.name = old_initiative.name;
    initiative.official_code = old_initiative.official_code;
    initiative.parent_id = old_init_id;
    initiative.created_by_user_id = user.id;
    initiative.phase_id = phase?.id;
    const new_init = await this.iniRepository.save(initiative, {
      reload: true,
    });

    await this.iniRepository
      .createQueryBuilder()
      .update(Initiative)
      .set({
        last_version_id: new_init.id,
        last_updated_date: old_initiative.last_updated_date,
      })
      .where(`id = ${old_initiative.id}`)
      .execute();

    const old_Risks = await this.riskService.riskRepository.find({
      where: { initiative_id: old_init_id },
      relations: ['mitigations', 'mitigations.status'],
    });
    if (old_Risks.length)
      for (let risk of old_Risks) {
        risk.original_risk_id = risk.id;
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
    await this.iniRepository.update(new_init.id, { submit_date: date, status: true });
    if (old_initiative?.roles)
      old_initiative.roles.forEach((role) => {
        if (
          role?.user &&
          (role.role == 'Leader' || role.role == 'Coordinator')
        )
          this.emailsService.sendEmailTobyVarabel(role?.user, 3, old_init_id, null);
      });
    let admins = await this.userService.userRepository.find({
      where: { role: 'admin' },
    });
    admins.forEach((user: User) => {
      this.emailsService.sendEmailTobyVarabel(user, 3, old_init_id, null);
    });
    return await this.iniRepository.findOne({
      where: { id: new_init.id },
      relations: ['risks'],
    });
  }

  async setRole(initiative_id, role: InitiativeRoles) {
    const countOfleaders = await this.iniRolesRepository.findAndCount({
      where: { initiative_id: initiative_id, role: 'Leader' },
    });
    if (countOfleaders[1] >= 2 && role.role == 'Leader')
      throw new BadRequestException(
        `You can't add more than two leaders to the Initiative`,
      );

    let userInInit: any;
    let isExistsUser: any;
    let emailIsInUsersEmail: any;
    if (role.email == '') {
      userInInit = await this.iniRolesRepository.findOne({
        where: { initiative_id: initiative_id, user_id: role.user_id },
      });
    } else {
      //invite by email
      userInInit = await this.iniRolesRepository.findOne({
        where: { initiative_id: initiative_id, email: role.email },
      });
      emailIsInUsersEmail = await this.iniRolesRepository.findOne({
        where: { initiative_id: initiative_id, user: { email: role.email } },
      });
      isExistsUser = await this.userService.findByEmail(role.email);
    }
    if (userInInit == null && role.email == '') {
      let init = await this.iniRepository.findOne({
        where: { id: initiative_id },
        relations: ['roles'],
      });
      if (!init) throw new NotFoundException();
      const newRole = {
        initiative_id: initiative_id,
        user_id: +role?.user_id ? role?.user_id : null,
        email: role.email.toLowerCase(),
        role: role.role,
      };
      //To the user that was added by the Admin or Leader/Coordinator
      if (role?.user_id) {
        const user = await this.userService.userRepository.findOne({
          where: { id: role?.user_id },
        });
        if (user) this.emailsService.sendEmailTobyVarabel(user, 10, initiative_id, null);
      }
      return await this.iniRolesRepository.save(newRole, { reload: true });
    } else if (
      userInInit == null &&
      emailIsInUsersEmail == null &&
      role.email != ''
    ) {
      let init = await this.iniRepository.findOne({
        where: { id: initiative_id },
        relations: ['roles'],
      });
      if (!init) throw new NotFoundException();
      const newRole = {
        initiative_id: initiative_id,
        user_id: +role?.user_id ? role?.user_id : null,
        email: role.email.toLowerCase(),
        role: role.role,
      };
      //To the user that was added by the Admin or Leader/Coordinator

      this.emailsService.sendEmailTobyVarabel(
        { full_name: '', email: newRole.email },
        10,
        initiative_id,
        null
      );

      return await this.iniRolesRepository.save(newRole, { reload: true });
    } else {
      throw new BadRequestException(
        'the user already has already the role in this initiative',
      );
    }
  }

  async syncActionAreaFromClarisa() {
    try {
      const clarisa_action_area = await firstValueFrom(
        this.http
          .get(`${process.env.CLARISA_URL}/api/action-areas`, {
            auth: this.clarisa_auth(),
          })
          .pipe(map((d) => d.data)),
      );
      for (const action_area of clarisa_action_area) {
        let actionArea;
        actionArea = await this.actionAreaRepository.findOne({
          where: { id: action_area.id },
        });
        if (!actionArea) {
          actionArea = this.actionAreaRepository.create();
          actionArea.id = action_area.id;
        }
        actionArea.name = action_area.name;
        actionArea.description = action_area.description;
        await this.actionAreaRepository.save(actionArea);
      }
    } catch (error) {
      this.logger.error('Error in Sync CLARISA initiative Data ', error);
    }
  }
  async syncFromClarisa() {
    try {
      const clarisa_initiatives = await firstValueFrom(
        this.http
          .get(`${process.env.CLARISA_URL}/api/initiatives`, {
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
        initiative.action_area_id = clarisa_initiative.action_area_id;
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
    this.syncActionAreaFromClarisa();
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

    for (let init of allInit) {
      const lastVersion = await this.iniRepository.findOne({
        where: { parent_id: init.id },
        relations: ['risks'],
        order: { id: 'DESC', risks: { id: 'DESC', top: 'ASC' } },
      });
      if (lastVersion != null) {
        if (
          new Date(init.last_updated_date).valueOf() ==
          new Date(lastVersion.submit_date).valueOf()
        ) {
          this.iniRepository
            .createQueryBuilder()
            .update(Initiative)
            .set({
              status: true,
              last_updated_date: init.last_updated_date,
            })
            .where(`id = ${init.id}`)
            .execute();
        } else if (init.status == true) {
          if (
            new Date(init.last_updated_date).valueOf() !=
            new Date(lastVersion.submit_date).valueOf()
          ) {
            this.iniRepository
              .createQueryBuilder()
              .update(Initiative)
              .set({
                status: false,
                last_updated_date: new Date(),
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
          //this.emailsService.sendEmailTobyVarabel(found_users[0], 7);

          await this.iniRolesRepository.save(user_role);
        }
      }
      this.logger.log('Sync Users Roles');
    } catch (e) {
      this.logger.error('Error in Sync CLARISA initiative Data ', e);
    }
  }
  async archiveInit(data: any) {
    for(let id of data.ids) {
      const init = await this.iniRepository.findOne({where: {id: id}});
      const submittedVersion = await this.iniRepository.find({
        where: { parent_id: id },
        order: {
          risks: {
            top: 'ASC'
          }
        },
        relations: ['risks', 'risks.initiative', 'risks.mitigations' , 'risks.mitigations.status' , 'risks.category' , 'risks.created_by' , 'risks.risk_owner.user' , 'created_by', 'phase']
      });
      const roles = await this.iniRolesRepository.find({
        where: { initiative_id: id},
        relations: ['user']
      });

      const allData = {
        version: submittedVersion,
        roles: roles
      }

      const archived = this.archiveRepository.create();
      archived.init_data = JSON.stringify(allData);
      archived.initiative = init;
      
      await this.archiveRepository.save(archived).then(
        async () => {
          await this.iniRepository.update(id, {
            archived: true
          });
        }, (error) => {
          console.log('error => ', error);
          throw new BadRequestException(
            `something wrong`,
          );
        }
      )
    }
  }
  async getArchiveInit(query: any, req: any) {
   return await this.archiveRepository.find({
    relations: ['initiative', 'initiative.roles', 'initiative.roles.user', 'initiative.risks','initiative.risks.category'],
    where: {
      initiative: {
        name: query?.name ? ILike(`%${query.name}%`) : null,
        official_code: query.initiative_id ? In([
          `INIT-0${query.initiative_id}`,
          `INIT-${query.initiative_id}`,
          `PLAT-${query.initiative_id}`,
          `PLAT-0${query.initiative_id}`,
          `SGP-${query.initiative_id}`,
          `SGP-0${query.initiative_id}` 
        ]) : Not(IsNull()),
        ...this.roles(query, req),
        risks: { ...this.filterCategory(query, 'For Init') }
      }
    }
   });
  }

  async getArchiveInitById(id: number) {
    return await this.archiveRepository.findOne({
      where: {
        id: id
      },
      relations: ['initiative']
    })
  }

  async syncInit(data: any) {
    try {
      let actionAreaIds = [];
      const clarisa_initiatives = await firstValueFrom(
        this.http
          .get(`${process.env.CLARISA_URL}/api/initiatives`, {
            auth: this.clarisa_auth(),
          })
          .pipe(map((d) => d.data)),
      );

      for (const clarisa_initiative of clarisa_initiatives) {
        for(let id of data.ids) {
          let initiative;
          initiative = await this.iniRepository.findOne({
            where: { id: id, clarisa_id: clarisa_initiative.id },
          });
          if (initiative) {
            initiative.clarisa_id = clarisa_initiative.id;
            initiative.name = clarisa_initiative.name;
            initiative.official_code = clarisa_initiative.official_code;
            initiative.action_area_id = clarisa_initiative.action_area_id;
            initiative.sync_clarisa = true;
            await this.iniRepository.save(initiative);
            actionAreaIds.push(initiative.action_area_id);
          }
        }
      }
      actionAreaIds = [...new Set(actionAreaIds)];
      this.syncActionAreaByIdFromClarisa(actionAreaIds)
    } catch (e) {
      throw new BadRequestException(
        `Error sync clarisa`,
      );
    }
  }

  async syncActionAreaByIdFromClarisa(ids: number []) {
    try {
      const clarisa_action_area = await firstValueFrom(
        this.http
          .get(`${process.env.CLARISA_URL}/api/action-areas`, {
            auth: this.clarisa_auth(),
          })
          .pipe(map((d) => d.data)),
      );
      for (const action_area of clarisa_action_area) {
        for(let id of ids) {
          let actionArea;
          actionArea = await this.actionAreaRepository.findOne({
            where: { id: id },
          });
          if (actionArea && id == action_area.id) {
            actionArea.id = action_area.id;
            actionArea.name = action_area.name;
            actionArea.description = action_area.description;
            await this.actionAreaRepository.save(actionArea);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error in Sync CLARISA initiative Data ', error);
    }
  }
}
