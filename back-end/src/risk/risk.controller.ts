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
import { ILike, In } from 'typeorm';
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
  filterCategory(query) {
    if (query?.category) {
      if (Array.isArray(query?.category)) {
        return {
          id: In(query.category),
        };
      } else
        return {
          id: query.category,
        };
    }
    else return {};
  }
  @ApiBearerAuth()
  @Roles(Role.Admin,Role.User)
  @Get('risksOwner')
  async getRisksOwner(@Query('initiative_id') initId: number, @Query('user_id') user_id: number) {
    const risks = await this.riskService.riskRepository.find({
      where : {
        program_id: initId,
        risk_owner: {
          user_id: user_id
        }
      }
    });
    return risks;
  }
  @ApiBearerAuth()
  @Get('')
  @ApiCreatedResponse({
    description: '',
    type: GetRiskDto,
  })
  async getRisk(@Query() query) {
  
    const redundentRisk = await this.riskService.riskRepository.find({
      where: {
        program_id: query.initiative_id,
        redundant: true
      },
      relations: [
        'category',
        'program',
        'mitigations',
        'mitigations.status',
        'created_by',
        'risk_owner',
        'risk_owner.user',
      ],
    });
    const notredundentRisk = await this.riskService.riskRepository.find({
      where: {
        program_id: query.initiative_id,
        redundant: false
      },
      relations: [
        'category',
        'program',
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
        program_id: query.initiative_id,
        category : { ...this.filterCategory(query) },
        // category_id: query?.category ? In(query?.category)  : null,
        created_by_user_id: query?.created_by ? Array.isArray(query?.created_by) ?  In( query?.created_by) : query?.created_by : null,
        risk_owner_id:  query?.owner ? Array.isArray(query?.owner) ?  In( query?.owner) : query?.owner : null,
        redundant: query?.redundant == 'true' ? null : false,
        request_assistance: query?.request_assistance == 'true' ? true : null,
      },
      relations: [
        'category',
        'program',
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
  @ApiBearerAuth()
  @Get(':id')
  getRisks(@Param('id') id: number) {
    return this.riskService.riskRepository.find({
      where: { id },
      relations: [
        'category',
        'program',
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
  @ApiBearerAuth()
  @Roles(Role.Admin,Role.User)
  @Put(':risk_id')
  setRisk(@Body() risk: Risk, @Param('risk_id') id: number, @Request() req) {
    return this.riskService.updateRisk(id, risk, req.user,false);
  }
  @ApiBearerAuth()
  @Roles(Role.Admin,Role.User)
  @Delete(':risk_id/init_id/:initiative_id')
  @ApiCreatedResponse({
    description: '',
    type: Risk,
  })
  deleteRisk(@Param('risk_id') risk_id: number) {
    return this.riskService.deleteRisk(risk_id);
  }
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @Roles(Role.Admin,Role.User)
  @Patch(':risk_id/redundant/:initiative_id')
  @ApiCreatedResponse({
    description: '',
    type: PatchRiskResponseDto,
  })
  @ApiBody({ type: PatchRiskRequestDto })
  async patchRedandant(@Param('risk_id') id: number, @Body('redundant') redundant) {
    await this.riskService.riskRepository.update({ id }, { redundant });
    await this.riskService.updateInitiativeUpdateDateToNowByRiskID(id);
    return this.riskService.riskRepository.findOne({ where: { id } });
  }
}
