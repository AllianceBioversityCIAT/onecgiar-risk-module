import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
import { query } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ILike } from 'typeorm';
import { RiskService } from './risk.service';
@ApiTags('Risk')
@Controller('risk')
export class RiskController {
  constructor(private riskService: RiskService) {}
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return {  top:'ASC', id: 'ASC' };
  }
  @Get('')
  @ApiCreatedResponse({
    description: '',
    type: [Risk],
  })
  getRisk(@Query() query) {
    return this.riskService.riskRepository.find({
      where: {
        title:query?.title ?  ILike(`%${query.title}%`) : null, 
        initiative_id: query.initiative_id,
        category_id: query?.category ? query?.category : null,
        created_by_user_id:query?.created_by ? query?.created_by : null,
        risk_owner_id:query?.owner ? query?.owner : null,
        redundant: query?.redundant == 'true' ? null : false
      },
      relations: [
        'category',
        'initiative',
        'mitigations',
        'mitigations.status',
        'created_by',
        'risk_owner',
        'risk_owner.user',
      ],
      order: { ...this.sort(query) },
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
        'mitigations.status',
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
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: '',
    type: Risk,
  })
  @Put(':id')
  setRisk(@Body() risk: Risk, @Param('id') id: number, @Request() req) {
    console.log(risk);
    console.log(id);
    // console.log( req.user);

    return this.riskService.updateRisk(id, risk, req.user);
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
