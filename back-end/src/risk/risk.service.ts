import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(Risk)
    public riskRepository: Repository<Risk>,
    @InjectRepository(Mitigation)
    public mitigationRepository: Repository<Mitigation>,
  ) {}

  async setMitigation(risk_id, mitigation: Mitigation) {
    let risk = await this.riskRepository.findOne({
      where: { id: risk_id },
      relations: ['mitigations'],
    });
    if (!risk) throw new NotFoundException();
    return await this.mitigationRepository.save(mitigation, { reload: true });
  }
  async createRisk(risk: Risk) {
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
    return created_risk;
  }
  async updateMitigation(risk_id, id , mitigation: Mitigation) {
    const found_mitigation = await this.mitigationRepository.findOne({
      where: { risk_id, id },
    });
    if (found_mitigation) return await this.mitigationRepository.save(mitigation);
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
