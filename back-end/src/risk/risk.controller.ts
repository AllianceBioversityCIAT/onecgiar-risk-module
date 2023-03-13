import { Controller, Get, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Risk } from 'entities/risk.entity';
import { RiskService } from './risk.service';
@ApiTags('Risk')
@Controller('risk')
export class RiskController {
  constructor(private riskService: RiskService) {}

  @Get('')
  @ApiCreatedResponse({
    description: '',
    type: [Risk],
  })
  getRisk() {
    return this.riskService.riskRepository.find({
      relations: ['categories', 'initiative', 'mitigations'],
    });
  }
  @ApiCreatedResponse({
    description: '',
    type: Risk,
  })
  @Get(':id')
  getRisks(@Param('id') id: number) {
    return this.riskService.riskRepository.find({
      where: { id },
      relations: ['categories', 'initiative', 'mitigations'],
    });
  }
}
