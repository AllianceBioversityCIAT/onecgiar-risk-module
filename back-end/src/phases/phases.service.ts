import { Injectable } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phase } from 'entities/phase.entity';

@Injectable()
export class PhasesService {
  constructor(
    @InjectRepository(Phase) private phaseRepository: Repository<Phase>,
  ) {}

  create(createPhaseDto: CreatePhaseDto) {
    const newPhase = this.phaseRepository.create({ ...createPhaseDto });
    return this.phaseRepository.save(newPhase);
  }

  findAll() {
    return this.phaseRepository.find({ relations: ['previousPhase'] });
  }

  findOne(id: number) {
    return this.phaseRepository.findOne({
      where: { id },
      relations: ['previousPhase'],
    });
  }

  findActivePhase() {
    return this.phaseRepository.findOne({
      where: { active: true },
      relations: ['previousPhase'],
    });
  }

  update(id: number, updatePhaseDto: UpdatePhaseDto) {
    return this.phaseRepository.update({ id }, { ...updatePhaseDto });
  }

  remove(id: number) {
    return this.phaseRepository.delete({ id });
  }

  activate(id: number) {
    this.phaseRepository.update({}, { active: false });
    return this.phaseRepository.update({ id }, { active: true });
  }

  deactivate(id: number) {
    return this.phaseRepository.update({ id }, { active: false });
  }
}