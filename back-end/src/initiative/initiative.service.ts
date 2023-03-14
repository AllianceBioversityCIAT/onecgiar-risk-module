import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class InitiativeService {
  constructor(
    @InjectRepository(Initiative)
    public iniRepository: Repository<Initiative>,
    @InjectRepository(InitiativeRoles)
    public iniRolesRepository: Repository<InitiativeRoles>,
    private http: HttpService,
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

  async updateRoles(initiative_id, id, initiativeRoles: InitiativeRoles) {
    const found_roles = await this.iniRolesRepository.findOne({
      where: { initiative_id, id },
    });
    if (found_roles) return await this.iniRolesRepository.save(initiativeRoles);
    else throw new NotFoundException();
  }

  async setRole(initiative_id, role: InitiativeRoles) {
    let init = await this.iniRepository.findOne({
      where: { id: initiative_id },
      relations: ['roles'],
    });
    if (!init) throw new NotFoundException();
    return await this.iniRolesRepository.save(role, { reload: true });
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
  handleCron() {
    this.syncFromClarisa();
  }
}
