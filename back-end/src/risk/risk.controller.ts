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
import { CreateRiskRequestDto, CreateRiskResponseDto, GetRiskDto, MitigationCreateRiskResponseDto, PatchRiskRequestDto, PatchRiskResponseDto, UpdateRiskRequestDto, UpdateRiskResponseDto } from 'DTO/risk.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
@ApiTags('Risk')
@Controller('risk')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Get('risksOwner')
  async getRisksOwner(@Query('initId') initId: number, @Query('user_id') user_id: number) {
    console.log(initId)
    console.log(user_id)
    const risks = await this.riskService.riskRepository.find({
      where : {
        initiative_id: initId,
        risk_owner: {
          user_id: user_id
        }
      }
    });
    return risks;
  }
  @Get('')
  @ApiCreatedResponse({
    description: '',
    type: GetRiskDto,
  })
  async getRisk(@Query() query) {
    const redundentRisk = await this.riskService.riskRepository.find({
      where: {
        initiative_id: query.initiative_id,
        redundant: true
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
    });
    const notredundentRisk = await this.riskService.riskRepository.find({
      where: {
        initiative_id: query.initiative_id,
        redundant: false
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
    });
    const risks = await this.riskService.riskRepository.find({
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
    const result = {
      risks: risks,
      redundentRisk: redundentRisk,
      notredundentRisk: notredundentRisk
    };
    return result
  }
  @ApiCreatedResponse({
    description: '',
    type: GetRiskDto,
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
    type: CreateRiskResponseDto,
  })
  @ApiBody({ type: CreateRiskRequestDto })
  @ApiBearerAuth()
  @Roles(Role.Admin,Role.User)
  @Post()
  setRisks(@Body() risk: Risk, @Request() req) {
    return this.riskService.createRisk(risk, req.user);
  }
  @ApiCreatedResponse({
    description: '',
    type: UpdateRiskResponseDto,
  })
  @ApiBody({ type: UpdateRiskRequestDto })
  @Roles(Role.Admin,Role.User)
  @Put(':risk_id')
  setRisk(@Body() risk: Risk, @Param('risk_id') id: number, @Request() req) {
    return this.riskService.updateRisk(id, risk, req.user);
  }
  @Roles(Role.Admin,Role.User)
  @Delete(':risk_id/init_id/:initiative_id')
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
    type: MitigationCreateRiskResponseDto,
  })
  getRoles(@Param('risk_id') risk_id: number): Promise<Mitigation[]> {
    return this.riskService.mitigationRepository.find({
      where: { risk_id },
    });
  }

  @Patch(':id/redundant')
  @ApiCreatedResponse({
    description: '',
    type: PatchRiskResponseDto,
  })
  @ApiBody({ type: PatchRiskRequestDto })
  async patchRedandant(@Param('id') id: number, @Body('redundant') redundant) {
    await this.riskService.riskRepository.update({ id }, { redundant });
    await this.riskService.updateInitiativeUpdateDateToNowByRiskID(id);
    return this.riskService.riskRepository.findOne({ where: { id } });
  }
}
