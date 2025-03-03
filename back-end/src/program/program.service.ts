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
import { ProgramRoles } from 'entities/program-roles.entity';
import { Program } from 'entities/program.entity';
import { Risk } from 'entities/risk.entity';
import { User } from 'entities/user.entitiy';
import { firstValueFrom, map } from 'rxjs';
import { EmailsService } from 'src/emails/emails.service';
import { RiskService } from 'src/risk/risk.service';
import { UsersService } from 'src/users/users.service';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { PhasesService } from 'src/phases/phases.service';
import { Archive } from 'entities/archive.entity';
import { Organization } from 'entities/organization.entity';
@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    public programRepository: Repository<Program>,
    @InjectRepository(ProgramRoles)
    public programRolesRepository: Repository<ProgramRoles>,
    @InjectRepository(ActionArea)
    public actionAreaRepository: Repository<ActionArea>,
    @InjectRepository(Archive)
    public archiveRepository: Repository<Archive>,
    @InjectRepository(Organization)
    public organizationRepo: Repository<Organization>,
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
  private readonly logger = new Logger(ProgramService.name);
  clarisa_auth() {
    return {
      username: process.env.CLARISA_USERNAME,
      password: process.env.CLARISA_PASSWORD,
    };
  }
  async deleteRole(program_id, id) {
    const roles = await this.programRolesRepository.findOne({
      where: { program_id, id },
    });
    if (roles) return await this.programRolesRepository.remove(roles);
    else throw new NotFoundException();
  }

  async updateInitiativeUpdateDateToNow(initiative_id) {
    await this.programRepository.update(initiative_id, {
      last_updated_date: new Date(),
    });
  }
  async updateRoles(program_id, id, initiativeRoles: any) {
    let userInInit: any;
    let emailIsInUsersEmail: any;

    const countOfleaders = await this.programRolesRepository.findAndCount({
      where: {
        program_id: program_id,
        role: 'Leader',
        id: Not(initiativeRoles.id)
      },
    });

    if(initiativeRoles.user_id == null) {
      userInInit = await this.programRolesRepository.findOne({
        where: { id: Not(initiativeRoles?.id), program_id: program_id, email: initiativeRoles.email },
      });

      emailIsInUsersEmail = await this.programRolesRepository.findOne({
        where: { program_id: program_id, user: { email: initiativeRoles.email } },
        relations: ['user']
      });

      if(userInInit?.email == initiativeRoles?.email || initiativeRoles?.email == emailIsInUsersEmail?.user?.email) {
        throw new BadRequestException(
          `the user already has already the role in this initiative`,
        );
      }
    } else {
      userInInit = await this.programRolesRepository.findOne({
        where: { id: Not(initiativeRoles?.id), program_id: program_id, user_id: initiativeRoles?.user_id?.id ? initiativeRoles?.user_id?.id : initiativeRoles?.user_id,},
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

    const found_roles = await this.programRolesRepository.findOne({
      where: { program_id, id },
    });
    if (found_roles) return await this.programRolesRepository.save(initiativeRoles);
    else throw new NotFoundException();
  }

  async createINIT(old_init_id: number, user, top: Risk[]) {
    const old_program = await this.programRepository.findOne({
      where: { id: old_init_id },
      relations: ['roles', 'roles.user'],
    });
    const allRisks = await this.riskService.riskRepository.find({
      where: { program_id: old_init_id },
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

    const programs = this.programRepository.create();
    programs.clarisa_id = old_program.clarisa_id;
    programs.name = old_program.name;
    programs.official_code = old_program.official_code;
    programs.parent_id = old_init_id;
    programs.created_by_user_id = user.id;
    programs.phase_id = phase?.id;
    const new_init = await this.programRepository.save(programs, {
      reload: true,
    });

    await this.programRepository
      .createQueryBuilder()
      .update(Program)
      .set({
        last_version_id: new_init.id,
        last_updated_date: old_program.last_updated_date,
      })
      .where(`id = ${old_program.id}`)
      .execute();

    const old_Risks = await this.riskService.riskRepository.find({
      where: { program_id: old_init_id },
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

        risk.program_id = new_init.id;
        await this.riskService.createRisk(risk);
      }
    let date = new Date();
    await this.programRepository.update(old_init_id, { last_updated_date: date });
    await this.programRepository.update(new_init.id, { submit_date: date, status: true });
    if (old_program?.roles)
      old_program.roles.forEach((role) => {
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
    return await this.programRepository.findOne({
      where: { id: new_init.id },
      relations: ['risks'],
    });
  }

  async setRole(program_id, role: ProgramRoles) {
    const countOfleaders = await this.programRolesRepository.findAndCount({
      where: { program_id: program_id, role: 'Leader' },
    });
    if (countOfleaders[1] >= 2 && role.role == 'Leader')
      throw new BadRequestException(
        `You can't add more than two leaders to the Initiative`,
      );

    let userInInit: any;
    let isExistsUser: any;
    let emailIsInUsersEmail: any;
    if (role.email == '') {
      userInInit = await this.programRolesRepository.findOne({
        where: { program_id: program_id, user_id: role.user_id },
      });
    } else {
      //invite by email
      userInInit = await this.programRolesRepository.findOne({
        where: { program_id: program_id, email: role.email },
      });
      emailIsInUsersEmail = await this.programRolesRepository.findOne({
        where: { program_id: program_id, user: { email: role.email } },
      });
      isExistsUser = await this.userService.findByEmail(role.email);
    }
    if (userInInit == null && role.email == '') {
      let init = await this.programRepository.findOne({
        where: { id: program_id },
        relations: ['roles'],
      });
      if (!init) throw new NotFoundException();
      const newRole = {
        program_id: program_id,
        user_id: +role?.user_id ? role?.user_id : null,
        email: role.email.toLowerCase(),
        role: role.role,
      };
      //To the user that was added by the Admin or Leader/Coordinator
      if (role?.user_id) {
        const user = await this.userService.userRepository.findOne({
          where: { id: role?.user_id },
        });
        if (user) this.emailsService.sendEmailTobyVarabel(user, 10, program_id, null);
      }
      return await this.programRolesRepository.save(newRole, { reload: true });
    } else if (
      userInInit == null &&
      emailIsInUsersEmail == null &&
      role.email != ''
    ) {
      let init = await this.programRepository.findOne({
        where: { id: program_id },
        relations: ['roles'],
      });
      if (!init) throw new NotFoundException();
      const newRole = {
        program_id: program_id,
        user_id: +role?.user_id ? role?.user_id : null,
        email: role.email.toLowerCase(),
        role: role.role,
      };
      //To the user that was added by the Admin or Leader/Coordinator

      this.emailsService.sendEmailTobyVarabel(
        { full_name: '', email: newRole.email },
        10,
        program_id,
        null
      );

      return await this.programRolesRepository.save(newRole, { reload: true });
    } else {
      throw new BadRequestException(
        'the user already has already the role in this initiative',
      );
    }
  }

  // async syncActionAreaFromClarisa() {
  //   try {
  //     const clarisa_action_area = await firstValueFrom(
  //       this.http
  //         .get(`${process.env.CLARISA_URL}/api/action-areas`, {
  //           auth: this.clarisa_auth(),
  //         })
  //         .pipe(map((d) => d.data)),
  //     );
  //     for (const action_area of clarisa_action_area) {
  //       let actionArea;
  //       actionArea = await this.actionAreaRepository.findOne({
  //         where: { id: action_area.id },
  //       });
  //       if (!actionArea) {
  //         actionArea = this.actionAreaRepository.create();
  //         actionArea.id = action_area.id;
  //       }
  //       actionArea.name = action_area.name;
  //       actionArea.description = action_area.description;
  //       await this.actionAreaRepository.save(actionArea);
  //     }
  //   } catch (error) {
  //     this.logger.error('Error in Sync CLARISA initiative Data ', error);
  //   }
  // }
  // async syncFromClarisa() {
  //   try {
  //     const clarisa_initiatives = await firstValueFrom(
  //       this.http
  //         .get(`${process.env.CLARISA_URL}/api/initiatives`, {
  //           auth: this.clarisa_auth(),
  //         })
  //         .pipe(map((d) => d.data)),
  //     );

  //     for (const clarisa_initiative of clarisa_initiatives) {
  //       let program;
  //       program = await this.programRepository.findOne({
  //         where: { clarisa_id: clarisa_initiative.id },
  //       });
  //       if (!program) {
  //         program = this.programRepository.create();
  //         program.clarisa_id = clarisa_initiative.id;
  //       }
  //       program.name = clarisa_initiative.name;
  //       program.official_code = clarisa_initiative.official_code;
  //       program.action_area_id = clarisa_initiative.action_area_id;
  //       await this.programRepository.save(program);
  //     }
  //     this.logger.log('Sync CLARISA initiative Data ');
  //   } catch (e) {
  //     this.logger.error('Error in Sync CLARISA initiative Data ', e);
  //   }
  // }
  
  // @Cron(CronExpression.EVERY_HOUR)
  // syncClarisa() { 
  //   this.syncFromClarisa();
  //   this.syncActionAreaFromClarisa();
  // } 

  @Cron(CronExpression.EVERY_10_SECONDS)
  syncUserRolesTask() {
    this.syncUserRoles();
  }
  @Cron(CronExpression.EVERY_10_SECONDS)
  async filterStatus() {
    this.logger.log('filterStatus is runing');
    const allInit = await this.programRepository.find({
      where: { parent_id: IsNull() },
      order: { id: 'DESC' },
    });

    for (let init of allInit) {
      const lastVersion = await this.programRepository.findOne({
        where: { parent_id: init.id },
        relations: ['risks'],
        order: { id: 'DESC', risks: { id: 'DESC', top: 'ASC' } },
      });
      if (lastVersion != null) {
        if (
          new Date(init.last_updated_date).valueOf() ==
          new Date(lastVersion.submit_date).valueOf()
        ) {
          this.programRepository
            .createQueryBuilder()
            .update(Program)
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
            this.programRepository
              .createQueryBuilder()
              .update(Program)
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
      const user_roles = await this.programRolesRepository.find({
        where: { user_id: IsNull() },
      });
      const users = await this.userService.userRepository.find();
      for (let user_role of user_roles) {
        let found_users = users.filter((u) => u.email == user_role.email);
        if (found_users.length) {
          user_role.user_id = found_users[0].id;
          // To the user that was added by the Admin or Leader/Coordinator
          //this.emailsService.sendEmailTobyVarabel(found_users[0], 7);

          await this.programRolesRepository.save(user_role);
        }
      }
      this.logger.log('Sync Users Roles');
    } catch (e) {
      this.logger.error('Error in Sync CLARISA initiative Data ', e);
    }
  }
  async archiveInit(data: any) {
    for(let id of data.ids) {
      const init = await this.programRepository.findOne({where: {id: id}});
      const submittedVersion = await this.programRepository.find({
        where: { parent_id: id },
        order: {
          risks: {
            top: 'ASC'
          }
        },
        relations: ['risks', 'risks.program', 'risks.mitigations' , 'risks.mitigations.status' , 'risks.category' , 'risks.created_by' , 'risks.risk_owner.user' , 'created_by', 'phase']
      });
      const roles = await this.programRolesRepository.find({
        where: { program_id: id},
        relations: ['user']
      });

      const allData = {
        version: submittedVersion,
        roles: roles
      }

      const archived = this.archiveRepository.create();
      archived.init_data = JSON.stringify(allData);
      archived.program = init;
      
      await this.archiveRepository.save(archived).then(
        async () => {
          await this.programRepository.update(id, {
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
    relations: ['program', 'program.roles', 'program.roles.user', 'program.risks','program.risks.category'],
    where: {
      program: {
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
      relations: ['program']
    })
  }

  async syncInit(data: any) { 
    try {
      // let actionAreaIds = [];
      const clarisa_initiatives = await firstValueFrom(
        this.http
          .get(`${process.env.CLARISA_URL}/api/cgiar-entities?version=2`, {
            auth: this.clarisa_auth(),
          })
          .pipe(
            map((response: any) => response.data.filter((item: any) => item.level == 1))
          ),
      );

      const filtered_clarisa_initiatives = clarisa_initiatives.filter(d => data.ids.includes(d.code))

      for (const clarisa_initiative of filtered_clarisa_initiatives) {
        let program;
        program = await this.programRepository.findOne({
          where: { official_code: clarisa_initiative.code, parent_id: IsNull() },
        });
        if (!program) {
          program = this.programRepository.create();
          // program.clarisa_id = clarisa_initiative.id;
          program.name = clarisa_initiative.name != null ? clarisa_initiative.name : clarisa_initiative.short_name;
          program.official_code = clarisa_initiative.code;
          // program.action_area_id = clarisa_initiative.action_area_id;
          program.sync_clarisa = true;
          await this.programRepository.save(program);
          // actionAreaIds.push(program.action_area_id);
        }
      }
      // actionAreaIds = [...new Set(actionAreaIds)];
      // this.syncActionAreaByIdFromClarisa(actionAreaIds)
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

  async clarisaPrograms() {
    try {
      const clarisa_initiatives = await firstValueFrom(
        this.http
          .get(`${process.env.CLARISA_URL}/api/cgiar-entities?version=2`, {
            auth: this.clarisa_auth(),
          })
          .pipe(
            map((response: any) => response.data.filter((item: any) => item.level == 1))
          ),
      );

      const programs = await this.programRepository.find({
        where: {
          parent_id : IsNull()
        }
      });

      const clarisaExistCodes = programs.map(d => d.official_code);

      return clarisa_initiatives.filter(d => !clarisaExistCodes.includes(d.code));

    } catch (e) {
      this.logger.error('Error in CLARISA (clarisaPrograms) ', e);
    }
  }
}
