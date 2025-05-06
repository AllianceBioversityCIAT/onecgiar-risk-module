import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  OnModuleInit,
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
import { DataSource, IsNull } from 'typeorm';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('Dashboard')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class DashboardController implements OnModuleInit {
  constructor(
    private dataSource: DataSource,
    private iniService: ProgramService,
    private riskService: RiskService,
  ) {}

  /** Remove ONLY_FULL_GROUP_BY so GROUP BY works as expected */
  async onModuleInit() {
    await this.dataSource.query(
      `SET SESSION sql_mode = (
         SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '')
       )`,
    );
  }

  @Roles()
  @Get('program/details')
  @ApiCreatedResponse({ type: [getProgram] })
  async getInitiativeDetails(@Query('isProject') isProject?: string) {
    const where: any = { parent_id: IsNull(), archived: false };
    if (isProject !== undefined) {
      where.isProject = isProject === '1';
    }
    return this.iniService.programRepository.find({
      where,
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
  @ApiCreatedResponse({ type: [getProgramScor] })
  async getInitiativeScore(@Query('isProject') isProject?: string) {
    const qb = this.dataSource
      .createQueryBuilder()
      .from('Program', 'Program')
      .addSelect('Program.id', 'id')
      .addSelect('Program.status', 'status')
      .where('Program.parent_id IS NULL')
      .andWhere('Program.archived = :archived', { archived: false });

    if (isProject !== undefined) {
      qb.andWhere('Program.isProject = :proj', { proj: isProject === '1' });
    }

    qb.addSelect('Program.official_code', 'official_code')
      .addSelect('Program.name', 'name')
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
      );

    return qb.execute();
  }

  @Roles()
  @Get('categories/levels')
  @ApiCreatedResponse({ type: [getCategoriesLevels] })
  async getCategories(@Query('isProject') isProject?: string) {
    const qb = this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id IS NULL')
      .andWhere('program.archived = :archived', { archived: false });

    if (isProject !== undefined) {
      qb.andWhere('program.isProject = :proj', { proj: isProject === '1' });
    }

    qb.addSelect('risk_category.id', 'id')
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
      .groupBy('risk_category.id, risk_category.title');

    return qb.execute();
  }

  @Roles()
  @Get('categories/count')
  @ApiCreatedResponse({ type: [getCategoriesCount] })
  async getcategoeis(@Query('isProject') isProject?: string) {
    const qb = this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id IS NULL')
      .andWhere('program.archived = :archived', { archived: false });

    if (isProject !== undefined) {
      qb.andWhere('program.isProject = :proj', { proj: isProject === '1' });
    }

    qb.addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect(
        (sub) =>
          sub
            .from(Risk, 'risk')
            .select('COUNT(risk.id)', 'total_count')
            .where('risk.original_risk_id IS NULL')
            .andWhere('risk.category_id = risk_category.id')
            .leftJoin('program', 'program', 'program.id = risk.program_id')
            .andWhere('program.archived = :archived', { archived: false }),
        'total_count',
      )
      .groupBy('risk_category.id, risk_category.title');

    return qb.execute();
  }

  @Roles()
  @Get('categories/groups/count')
  @ApiCreatedResponse({ type: [getCategoriesGroupsCount] })
  async getCategoriesGroups(@Query('isProject') isProject?: string) {
    const qb = this.dataSource
      .createQueryBuilder()
      .from('category_group', 'category_group')
      .addSelect('category_group.id', 'id')
      .addSelect('category_group.name', 'name')
      .leftJoin(
        'risk_category',
        'risk_category',
        'risk_category.category_group_id = category_group.id',
      )
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id IS NULL')
      .andWhere('program.archived = :archived', { archived: false });

    if (isProject !== undefined) {
      qb.andWhere('program.isProject = :proj', { proj: isProject === '1' });
    }

    qb.addSelect(
      (sub) =>
        sub
          .from(Risk, 'risk')
          .select('COUNT(risk.id)', 'total_count')
          .where('risk.original_risk_id IS NULL')
          .andWhere('risk.category_id = risk_category.id')
          .leftJoin('program', 'program', 'program.id = risk.program_id')
          .andWhere('program.archived = :archived', { archived: false }),
      'total_count',
    ).groupBy('category_group.id, category_group.name');

    return qb.execute();
  }

  @Roles()
  @Get('action_areas/count')
  @ApiCreatedResponse({ type: [getCategoriesGroupsCount] })
  async getActionAreasCount(@Query('isProject') isProject?: string) {
    const qb = this.dataSource
      .createQueryBuilder()
      .from('action_area', 'action_area')
      .addSelect('action_area.id', 'id')
      .addSelect('action_area.name', 'name')
      .leftJoin('program', 'program', 'program.action_area_id = action_area.id')
      .where('program.archived = :archived', { archived: false });

    if (isProject !== undefined) {
      qb.andWhere('program.isProject = :proj', { proj: isProject === '1' });
    }

    qb.addSelect('COUNT(risk.id)', 'total_count')
      .leftJoin('risk', 'risk', 'risk.program_id = program.id')
      .groupBy('action_area.id, action_area.name');

    return qb.execute();
  }

  @Roles()
  @Get('status')
  @ApiCreatedResponse({ type: [getDashboardStatus] })
  async getstatus(@Query('isProject') isProject?: string) {
    const qb = this.dataSource
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
      .andWhere('program.archived = :archived', { archived: false });

    if (isProject !== undefined) {
      qb.andWhere('program.isProject = :proj', { proj: isProject === '1' });
    }

    qb.addSelect('mitigation_status.id', 'id')
      .addSelect('mitigation_status.title', 'title')
      .addSelect(
        (sub) =>
          sub
            .from(Mitigation, 'mitigation')
            .select('COUNT(mitigation.id)', 'total_actions')
            .leftJoin('risk', 'risk', 'risk.id = mitigation.risk_id')
            .where('risk.original_risk_id IS NULL')
            .leftJoin('program', 'program', 'program.id = risk.program_id')
            .andWhere('program.archived = :archived', { archived: false })
            .andWhere('mitigation_status.id = mitigation.mitigation_status_id'),
        'total_actions',
      )
      .groupBy('mitigation_status.id, mitigation_status.title');

    return qb.execute();
  }

  @Get('risks/:id')
  risksCharts(@Param('id') id: number) {
    return this.riskService.riskRepository.find({
      where: { program_id: id, redundant: false },
    });
  }
}
