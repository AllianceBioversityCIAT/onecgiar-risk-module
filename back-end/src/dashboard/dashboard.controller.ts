import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  getCategoriesLevels,
  getCategoriesCount,
  getProgramScor,
  getCategoriesGroupsCount,
  getDashboardStatus,
} from 'DTO/dashboard.dto';
import { getProgram } from 'DTO/initiative.dto';
import { Program } from 'entities/program.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ProgramService } from 'src/program/program.service';
import { RiskService } from 'src/risk/risk.service';
import { DataSource, ILike, IsNull } from 'typeorm';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('Dashboard')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class DashboardController {
  constructor(
    private dataSource: DataSource,
    private iniService: ProgramService,
    private riskService: RiskService,
  ) {}

  @Roles()
  @Get('program/details')
  @ApiCreatedResponse({
    description: 'List programs/projects with their risks',
    type: [getProgram],
  })
  async getInitiativeDetails(
    @Query('isProject', ParseIntPipe) isProject: number = 0,
  ) {
    return this.iniService.programRepository.find({
      where: {
        parent_id: IsNull(),
        archived: false,
        isProject, // <-- filter programs vs projects
      },
      relations: [
        'risks',
        'risks.category',
        'risks.risk_owner',
        'roles',
        'roles.user',
      ],
      order: { risks: { current_level: 'DESC' } },
    });
  }

  @Roles()
  @Get('program/score')
  @ApiCreatedResponse({
    description: 'Average scores for programs/projects',
    type: [getProgramScor],
  })
  async getInitiativeScore(
    @Query('isProject', ParseIntPipe) isProject: number = 0,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .from('Program', 'Program')
      .addSelect('Program.id', 'id')
      .addSelect('Program.status', 'status')
      .addSelect('Program.official_code', 'official_code')
      .addSelect('Program.name', 'name')
      .where('Program.parent_id IS NULL')
      .andWhere('Program.archived = :archived', { archived: false })
      .andWhere('Program.isProject = :isProject', { isProject })
      .innerJoin(Risk, 'risk', 'risk.program_id = Program.id')
      .addSelect(
        (sub) =>
          sub
            .select('AVG(risk.target_impact)', 'target_impact')
            .from(Risk, 'risk')
            .where('risk.program_id = Program.id'),
        'target_impact',
      )
      .addSelect(
        (sub) =>
          sub
            .select('AVG(risk.target_likelihood)', 'target_likelihood')
            .from(Risk, 'risk')
            .where('risk.program_id = Program.id'),
        'target_likelihood',
      )
      .addSelect(
        (sub) =>
          sub
            .select('AVG(risk.current_impact)', 'current_impact')
            .from(Risk, 'risk')
            .where('risk.program_id = Program.id'),
        'current_impact',
      )
      .addSelect(
        (sub) =>
          sub
            .select('AVG(risk.current_likelihood)', 'current_likelihood')
            .from(Risk, 'risk')
            .where('risk.program_id = Program.id'),
        'current_likelihood',
      )
      .execute();
  }

  @Roles()
  @Get('categories/levels')
  @ApiCreatedResponse({
    description: 'Average risk levels by category',
    type: [getCategoriesLevels],
  })
  async getCategoriesLevels(
    @Query('isProject', ParseIntPipe) isProject: number = 0,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id IS NULL')
      .andWhere('program.archived = :archived', { archived: false })
      .andWhere('program.isProject = :isProject', { isProject })
      .addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect(
        (sub) =>
          sub
            .select('AVG(risk.target_level)', 'target_level')
            .from(Risk, 'risk')
            .where('risk.category_id = risk_category.id'),
        'target_level',
      )
      .addSelect(
        (sub) =>
          sub
            .select('AVG(risk.current_level)', 'current_level')
            .from(Risk, 'risk')
            .where('risk.category_id = risk_category.id'),
        'current_level',
      )
      .groupBy('risk_category.id')
      .execute();
  }

  @Roles()
  @Get('categories/count')
  @ApiCreatedResponse({
    description: 'Count of risks per category',
    type: [getCategoriesCount],
  })
  async getCategoriesCount(
    @Query('isProject', ParseIntPipe) isProject: number = 0,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id IS NULL')
      .andWhere('program.archived = :archived', { archived: false })
      .andWhere('program.isProject = :isProject', { isProject })
      .addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect(
        (sub) =>
          sub
            .select('COUNT(risk.id)', 'total_count')
            .from(Risk, 'risk')
            .leftJoin('program', 'program', 'program.id = risk.program_id')
            .where('risk.original_risk_id IS NULL')
            .andWhere('program.archived = :archived', { archived: false })
            .andWhere('program.isProject = :isProject', { isProject })
            .andWhere('risk.category_id = risk_category.id'),
        'total_count',
      )
      .groupBy('risk_category.id')
      .execute();
  }

  @Roles()
  @Get('categories/groups/count')
  @ApiCreatedResponse({
    description: 'Count of risks per category group',
    type: [getCategoriesGroupsCount],
  })
  async getCategoriesGroupsCount(
    @Query('isProject', ParseIntPipe) isProject: number = 0,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .from('category_group', 'category_group')
      .leftJoin(
        'risk_category',
        'risk_category',
        'risk_category.category_group_id = category_group.id',
      )
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id IS NULL')
      .andWhere('program.archived = :archived', { archived: false })
      .andWhere('program.isProject = :isProject', { isProject })
      .addSelect('category_group.id', 'id')
      .addSelect('category_group.name', 'name')
      .addSelect(
        (sub) =>
          sub
            .select('COUNT(risk.id)', 'total_count')
            .from(Risk, 'risk')
            .leftJoin('program', 'program', 'program.id = risk.program_id')
            .where('risk.original_risk_id IS NULL')
            .andWhere('program.archived = :archived', { archived: false })
            .andWhere('program.isProject = :isProject', { isProject })
            .andWhere('risk.category_id = risk_category.id'),
        'total_count',
      )
      .groupBy('category_group.id')
      .execute();
  }

  @Roles()
  @Get('action_areas/count')
  @ApiCreatedResponse({
    description: 'Count of risks per action area',
    type: [getCategoriesGroupsCount],
  })
  async getActionAreasCount(
    @Query('isProject', ParseIntPipe) isProject: number = 0,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .from('action_area', 'action_area')
      .leftJoin('program', 'program', 'program.action_area_id = action_area.id')
      .leftJoin('risk', 'risk', 'risk.program_id = program.id')
      .where('program.archived = :archived', { archived: false })
      .andWhere('program.isProject = :isProject', { isProject })
      .addSelect('action_area.id', 'id')
      .addSelect('action_area.name', 'name')
      .addSelect('COUNT(risk.id)', 'total_count')
      .groupBy('action_area.id')
      .execute();
  }

  @Roles()
  @Get('status')
  @ApiCreatedResponse({
    description: 'Count of mitigations by status',
    type: [getDashboardStatus],
  })
  async getStatus(@Query('isProject', ParseIntPipe) isProject: number = 0) {
    return this.dataSource
      .createQueryBuilder()
      .from('mitigation_status', 'mitigation_status')
      .leftJoin(
        'mitigation',
        'mitigation',
        'mitigation.mitigation_status_id = mitigation_status.id',
      )
      .leftJoin('risk', 'risk', 'risk.id = mitigation.risk_id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id IS NULL')
      .andWhere('program.archived = :archived', { archived: false })
      .andWhere('program.isProject = :isProject', { isProject })
      .addSelect('mitigation_status.id', 'id')
      .addSelect('mitigation_status.title', 'title')
      .addSelect(
        (sub) =>
          sub
            .select('COUNT(mitigation.id)', 'total_actions')
            .from(Mitigation, 'mitigation')
            .leftJoin('risk', 'risk', 'risk.id = mitigation.risk_id')
            .leftJoin('program', 'program', 'program.id = risk.program_id')
            .where('risk.original_risk_id IS NULL')
            .andWhere('program.archived = :archived', { archived: false })
            .andWhere('program.isProject = :isProject', { isProject })
            .andWhere('mitigation_status.id = mitigation.mitigation_status_id'),
        'total_actions',
      )
      .groupBy('mitigation_status.id')
      .execute();
  }

  @Roles()
  @Get('risks/:id')
  @ApiCreatedResponse({
    description: 'List risks for one program/project',
    type: Risk,
  })
  risksCharts(@Param('id', ParseIntPipe) id: number) {
    return this.riskService.riskRepository.find({
      where: { program_id: id, redundant: false },
    });
  }
}
