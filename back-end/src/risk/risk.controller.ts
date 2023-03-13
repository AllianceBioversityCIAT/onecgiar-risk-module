import { Controller, Get, Param } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private riskService: RiskService) {}

  @Get(['', ':id'])
  getRisks(@Param('id') id: number) {
    const options: FindManyOptions = {
      where: {},
      relations: ['categories', 'initiative', 'mitigations'],
    };
    if (id) options.where = { id };

    return this.riskService.riskRepository.find(options);
  }
}
