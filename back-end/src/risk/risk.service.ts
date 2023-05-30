import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Initiative } from 'entities/initiative.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { User } from 'entities/user.entitiy';
import { Repository } from 'typeorm';

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(Risk)
    public riskRepository: Repository<Risk>,
    @InjectRepository(Mitigation)
    public mitigationRepository: Repository<Mitigation>,
    @InjectRepository(Initiative)
    public initativeRepository: Repository<Initiative>,
  ) {}
  async updateInitiativeUpdateDateToNow(initiative_id) {
    await this.initativeRepository.update(initiative_id, {
      last_updated_date: new Date(),
    });
  }
  async setMitigation(risk_id, mitigation: Mitigation) {
    let risk = await this.riskRepository.findOne({
      where: { id: risk_id },
      relations: ['mitigations', 'risk_owner'],
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

  async updateRisk(id, risk: Risk) {
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
