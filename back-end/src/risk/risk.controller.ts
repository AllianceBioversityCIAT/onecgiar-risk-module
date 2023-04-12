import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,  
} from '@nestjs/swagger';
import { Mitigation } from 'entities/mitigation.entity';
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

  @ApiCreatedResponse({
    description: '',
    type: Risk,
  })
  @Post()
  setRisks(@Body() risk: Risk) {
    console.log(risk)
    return this.riskService.createRisk(risk);
  }

  @Delete(':risk_id')
  @ApiCreatedResponse({
    description: '',
    type: Risk,
  })
  deleteRisk(@Param('risk_id') risk_id: number) {
    return this.riskService.riskRepository.delete(risk_id);
  }

  @Get(':id/mitigation')
  @ApiCreatedResponse({
    description: '',
    type: [Mitigation],
  })
  getRoles(@Param('risk_id') risk_id: number): Promise<Mitigation[]> {
    return this.riskService.mitigationRepository.find({
      where: { risk_id },
    });
  }

  @Post(':risk_id/mitigation')
  @ApiCreatedResponse({
    description: '',
    type: Mitigation,
  })
  @ApiBody({
    type: Mitigation,
  })
  @ApiParam({
    name: 'risk_id',
    type: 'string',
  })
  setRoles(@Param('risk_id') risk_id: number, @Body() mitigation: Mitigation) {
    return this.riskService.setMitigation(risk_id, mitigation);
  }

  @Put(':risk_id/mitigation/:mitigation_id')
  @ApiCreatedResponse({
    description: '',
    type: Mitigation,
  })
  updateMitigation(
    @Body() mitigation: Mitigation,
    @Param('risk_id') risk_id: number,
    @Param('mitigation_id') mitigation_id: number,
  ) {
    return this.riskService.updateMitigation(
      risk_id,
      mitigation_id,
      mitigation,
    );
  }
  @Delete(':risk_id/mitigation/:mitigation_id')
  @ApiCreatedResponse({
    description: '',
    type: Mitigation,
  })
  deleteMitigation(
    @Param('risk_id') risk_id: number,
    @Param('mitigation_id') mitigation_id: number,
  ) {
    return this.riskService.deleteMitigation(risk_id, mitigation_id);
  }

 
}
