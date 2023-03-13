import { Controller, Get, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Initiative } from 'entities/initiative.entity';
import { FindManyOptions } from 'typeorm';
import { InitiativeService } from './initiative.service';

@ApiTags('Initiative')
@Controller('initiative')
export class InitiativeController {
  constructor(private iniService: InitiativeService) {}

  @Get()
  @ApiCreatedResponse({
    description: '',
    type: [Initiative],
  })
  getInitiative() {
    return this.iniService.iniRepository.findOne({
      relations: ['risks', 'risks.categories', 'roles', 'roles.user'],
    });
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: '',
    type: () => Initiative,
  })
  getInitiatives(@Param('id') id: number): Promise<Initiative> {
    return this.iniService.iniRepository.findOne({
      where: { id },
      relations: ['risks', 'risks.categories', 'roles', 'roles.user'],
    });
  }
}
