import { Controller, Get, Param } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { InitiativeService } from './initiative.service';

@Controller('initiative')
export class InitiativeController {
  constructor(private iniService: InitiativeService) {}
  @Get(['', ':id'])
  getInitiatives(@Param('id') id: number) {
    const options: FindManyOptions = {
      where: {},
      relations: ['risks', 'risks.categories', 'roles', 'roles.user'],
    };
    if (id) options.where = { id };
    return this.iniService.iniRepository.find(options);
  }

  @Get('test/test')
  test() {
    return this.iniService.syncFromClarisa();
  }
}
