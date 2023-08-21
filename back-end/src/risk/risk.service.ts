import { Global, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InitiativeRoles } from 'entities/initiative-roles.entity';
import { Initiative } from 'entities/initiative.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { User } from 'entities/user.entitiy';
import { EmailsService } from 'src/emails/emails.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
@Global()
@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(Risk)
    public riskRepository: Repository<Risk>,
    @InjectRepository(Mitigation)
    public mitigationRepository: Repository<Mitigation>,
    @InjectRepository(Initiative)
    public initativeRepository: Repository<Initiative>,
    private emailsService: EmailsService,
    @InjectRepository(InitiativeRoles)
    public initativeRolesRepository: Repository<InitiativeRoles>,
  ) {}
  async updateInitiativeUpdateDateToNow(initiative_id) {
    await this.initativeRepository.update(initiative_id, {
      last_updated_date: new Date(),
    });
  }
  async setMitigation(risk_id, mitigation: Mitigation) {
    let risk = await this.riskRepository.findOne({
      where: { id: risk_id },
      relations: ['mitigations','mitigations.status', 'risk_owner'],
    });
    if (!risk) throw new NotFoundException();
    return await this.mitigationRepository.save(mitigation, { reload: true });
  }
  async deleteRisk(id) {
    const risk = await this.riskRepository.findOne({
      where: { id },
    });
    await this.updateInitiativeUpdateDateToNow(risk.initiative_id);
    return this.riskRepository.delete(id);
  }

  async updateInitiativeUpdateDateToNowByRiskID(id) {
    const risk = await this.riskRepository.findOne({
      where: { id },
    });
    await this.updateInitiativeUpdateDateToNow(risk.initiative_id);
  }

  async updateRisk(id, risk: Risk, user: User) {
    let tobeadded = { ...risk };
    if (tobeadded.mitigations) delete tobeadded.mitigations;
    const created_risk = await this.riskRepository.save(
      this.riskRepository.create(tobeadded),
      { reload: true },
    );
    if (risk?.mitigations?.length) {
      await this.mitigationRepository.delete({ risk_id: created_risk.id });
      risk.mitigations.map((d) => (d.risk_id = created_risk.id));
      created_risk.mitigations = await this.mitigationRepository.save(
        this.mitigationRepository.create(risk.mitigations),
        { reload: true },
      );
    }
    await this.updateInitiativeUpdateDateToNow(risk.initiative_id);
    const initiative: Initiative = await this.initativeRepository.findOne({
      where: { id: risk.initiative_id },
      relations: ['roles', 'roles.user'],
    });

    if (
      initiative.roles
        .filter((d) => d.id == risk?.risk_owner_id)
        .filter((d) => d.user_id == user.id).length
    )
      initiative.roles.forEach((role: InitiativeRoles) => {
        if (
          (role.role == 'Leader' || role?.role == 'Coordinator') &&
          role?.user?.id
        )
          this.emailsService.sendEmailTobyVarabel(role?.user, 1, 2);
      });

    return created_risk;
  }
  async createRisk(risk: Risk, user: User = null) {
    if (user) risk.created_by_user_id = user.id;
    const created_risk = await this.riskRepository.save(
      this.riskRepository.create(risk),
      {
        reload: true,
      },
    );
    if (risk?.mitigations?.length) {
      risk.mitigations.map((d) => (d.risk_id = created_risk.id));
      created_risk.mitigations = await this.mitigationRepository.save(
        this.mitigationRepository.create(risk.mitigations),
        { reload: true },
      );
    }

    await this.updateInitiativeUpdateDateToNow(risk.initiative_id);

    if (created_risk?.risk_owner_id) {
      const risk_owner_role = await this.initativeRolesRepository.findOne({
        where: { id: created_risk.risk_owner_id },
        relations: ['user'],
      });
      if (risk_owner_role?.user)
        this.emailsService.sendEmailTobyVarabel(risk_owner_role?.user, 5, 6);
    }

    return created_risk;
  }
  async updateMitigation(risk_id, id, mitigation: Mitigation) {
    const found_mitigation = await this.mitigationRepository.findOne({
      where: { risk_id, id },
    });
    if (found_mitigation)
      return await this.mitigationRepository.save(mitigation);
    else throw new NotFoundException();
  }

  async deleteMitigation(risk_id, id) {
    const mitigation = await this.mitigationRepository.findOne({
      where: { risk_id, id },
    });
    if (mitigation) return await this.mitigationRepository.remove(mitigation);
    else throw new NotFoundException();
  }
}
