import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phase, phaseStatus } from 'entities/phase.entity';
import { Initiative } from 'entities/initiative.entity';

@Injectable()
export class PhasesService {
  constructor(
    @InjectRepository(Phase) public phaseRepository: Repository<Phase>,
    @InjectRepository(Initiative) public initRepository: Repository<Initiative>,
  ) {}

  create(createPhaseDto: CreatePhaseDto) {
    const newPhase = this.phaseRepository.create({ ...createPhaseDto });
    return this.phaseRepository.save(newPhase);
  }

  findAll() {
    return this.phaseRepository.find({ relations: ['previous_phase'] , order: {id:'ASC'} });
  }

  findOne(id: number) {
    return this.phaseRepository.findOne({
      where: { id },
      relations: ['previous_phase'],
    });
  }

  findActivePhase() {
    return this.phaseRepository.findOne({
      where: { active: true },
      relations: ['previous_phase'],
    });
  }

  update(id: number, updatePhaseDto: UpdatePhaseDto) {
    return this.phaseRepository.update({ id }, { ...updatePhaseDto });
  }

  async remove(id: number) { 
    const phaseHaveData = await this.initRepository.find({where : {
      phase_id: id
    }})
    if(phaseHaveData.length != 0) {
      throw new BadRequestException('The phase can not be deleted as it contains the submitted data');
    }
    else {
      return this.phaseRepository.delete({ id });
    }
  }

  async activate(id: number) {
    await this.phaseRepository.update({}, { active: false , status: phaseStatus.CLOSED });
    return await this.phaseRepository.update({ id }, { active: true, status: phaseStatus.OPEN });
  }

  async deactivate(id: number) {
    return await this.phaseRepository.update({ id }, { active: false, status: phaseStatus.CLOSED });
  }
}
