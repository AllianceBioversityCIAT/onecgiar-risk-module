import { Global, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { scienceProgramsRoles } from 'entities/initiative-roles.entity';
import { sciencePrograms } from 'entities/initiative.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Phase } from 'entities/phase.entity';
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
    @InjectRepository(sciencePrograms)
    public scienceProgramsRepository: Repository<sciencePrograms>,
    private emailsService: EmailsService,
    @InjectRepository(scienceProgramsRoles)
    public scienceProgramsRolesRepository: Repository<scienceProgramsRoles>,
    @InjectRepository(Phase)
    public PhaseRepository: Repository<Phase>,
  ) {}
  async updateInitiativeUpdateDateToNow(initiative_id) {
    await this.scienceProgramsRepository.update(initiative_id, {
      last_updated_date: new Date(),
    });

    const activePhase = await this.PhaseRepository.findOne({
      where: {
        active: true
      }
    });

    const lastVersionByPhase = await this.scienceProgramsRepository.findOne({
      where: { parent_id: initiative_id, phase_id: activePhase.id },
      order: { id: 'DESC' },
    });
    if(lastVersionByPhase)
      await this.scienceProgramsRepository.update(lastVersionByPhase?.id, {
        status: false
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
    await this.updateInitiativeUpdateDateToNow(risk.science_programs_id);
    return this.riskRepository.delete(id);
  }

  async updateInitiativeUpdateDateToNowByRiskID(id) {
    const risk = await this.riskRepository.findOne({
      where: { id },
    });
    await this.updateInitiativeUpdateDateToNow(risk.science_programs_id);
  }

  async updateRisk(id, risk: Risk, user: User, create_version: boolean) {
    const oldRisk = await this.riskRepository.findOne({
      where: {
        id : id
      },
      relations : ['risk_owner']
    })

    const newRiskOwner = await this.scienceProgramsRolesRepository.findOne({
      where: {
        id: risk.risk_owner_id
      },
      relations: ['user']
    })

    if (user) risk['update_by_user_id'] = user.id;
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
    await this.updateInitiativeUpdateDateToNow(risk.science_programs_id);
    const sciencePrograms: sciencePrograms = await this.scienceProgramsRepository.findOne({
      where: { id: risk.science_programs_id },
      relations: ['roles', 'roles.user'],
    });

    if (
      sciencePrograms.roles
        .filter((d) => d.id == risk?.risk_owner_id)
        .filter((d) => d.user_id == user.id).length
    )
      sciencePrograms.roles.forEach((role: scienceProgramsRoles) => {
        if (
          (role.role == 'Leader' || role?.role == 'Coordinator') &&
          role?.user?.id && create_version == false
        )
          this.emailsService.sendEmailTobyVarabel(role?.user, 1, sciencePrograms.id, created_risk);
      });

    if(oldRisk?.risk_owner?.user_id != newRiskOwner.user_id) {
      this.emailsService.sendEmailTobyVarabel(newRiskOwner?.user, 5, sciencePrograms.id, created_risk);
    } 
    else if(!oldRisk.risk_owner) { 
      this.emailsService.sendEmailTobyVarabel(newRiskOwner?.user, 5, sciencePrograms.id, created_risk);
    }

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

    await this.updateInitiativeUpdateDateToNow(risk.science_programs_id);

    if (created_risk?.risk_owner_id && created_risk.original_risk_id == null) {
      //get initiative
      const init = await this.scienceProgramsRepository.findOne({
        where: {
          id : created_risk.science_programs_id
        }
      })
      const risk_owner_role = await this.scienceProgramsRolesRepository.findOne({
        where: { id: created_risk.risk_owner_id },
        relations: ['user'],
      });
      if (risk_owner_role?.user)
        this.emailsService.sendEmailTobyVarabel(risk_owner_role?.user, 5, init.id, created_risk);
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
