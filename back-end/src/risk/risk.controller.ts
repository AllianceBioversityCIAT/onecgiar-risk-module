import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
      relations: [
        'category',
        'initiative',
        'mitigations',
        'created_by',
        'risk_owner',
      ],
      order: { id: 'ASC' },
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
      relations: [
        'category',
        'initiative',
        'mitigations',
        'created_by',
        'risk_owner',
      ],
      order: { id: 'ASC' },
    });
  }

  @ApiCreatedResponse({
    description: '',
    type: Risk,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  setRisks(@Body() risk: Risk, @Request() req) {
    console.log(risk);
    return this.riskService.createRisk(risk, req.user);
  }
  @ApiCreatedResponse({
    description: '',
    type: Risk,
  })
  @Put(':id')
  setRisk(@Body() risk: Risk, @Param('id') id: number) {
    return this.riskService.updateRisk(id, risk);
  }
  @Delete(':risk_id')
  @ApiCreatedResponse({
    description: '',
    type: Risk,
  })
  deleteRisk(@Param('risk_id') risk_id: number) {
    return this.riskService.deleteRisk(risk_id);
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

  @Patch(':id/redundant')
  @ApiCreatedResponse({
    description: '',
    type: [Risk],
  })
  async patchRedandant(@Param('id') id: number, @Body('redundant') redundant) {
    await this.riskService.riskRepository.update({ id }, { redundant });
    await this.riskService.updateInitiativeUpdateDateToNowByRiskID(id);
    return this.riskService.riskRepository.findOne({ where: { id } });
  }
  
}
