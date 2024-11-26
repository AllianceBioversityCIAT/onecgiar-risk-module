import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Phase, phaseStatus } from 'entities/phase.entity';
import { Program } from 'entities/program.entity';

@Injectable()
export class PhasesService {
  constructor(
    @InjectRepository(Phase) public phaseRepository: Repository<Phase>,
    @InjectRepository(Program) public programRepository: Repository<Program>,
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
    const phaseHaveData = await this.programRepository.find({where : {
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

  async getInitVersion(phaseId) {
    const data = await this.phaseRepository.findOne({
      where: {
        id: phaseId,
        program: {
          last_version_id: IsNull(),
        }
      },
      relations: ['program', 'program.created_by', 'program.risks']
    });


    //filter last version
    const newData = new Map<string, any>()
    data.program.forEach(value => {
      if (newData.has(value.official_code)) {
        const v1 = +newData.get(value.official_code).id;
        const v2 = + value.id;
        if (v1 < v2) newData.set(value.official_code, value);
      } else newData.set(value.official_code, value);
    });

    data.program = [...newData.values()]

    return data
  }
}
