import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { getCategoriesLevels, getCategoriesCount, getProgramScor, getCategoriesGroupsCount, getDashboardStatus } from 'DTO/dashboard.dto';
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
  constructor(private dataSource: DataSource,private iniService: ProgramService,private riskService: RiskService) {}

  @Roles()
  @Get('program/details')
  @ApiCreatedResponse({
    description: '',
    type: [getProgram],
  })
  getInitiativeDetails() {
    return this.iniService.programRepository.find({
        where: {
          parent_id: IsNull(),
          archived: false
        },
        relations: [
          'risks',
          'risks.category',
          'risks.risk_owner',
          'roles',
          'roles.user',
        ],
        order: {   risks: { current_level: 'DESC' } },
      });
  }
  @Roles()
  @Get('program/score')
  @ApiCreatedResponse({
    description: '',
    type: [getProgramScor],
  })
  getInitiativeScore() {
    return this.dataSource
      .createQueryBuilder()
      .from('Program', 'Program')
      .addSelect('Program.id', 'id')
      .addSelect('Program.status', 'status')
      .where('Program.parent_id is null')
      .andWhere("Program.archived = :archived", { archived: false })
      .addSelect('Program.official_code', 'official_code')
      .addSelect('Program.name', 'name')
      .innerJoin(Risk,'risk','risk.program_id = Program.id')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`AVG(risk.target_impact)`, 'target_impact')
          .where('risk.program_id = Program.id')
          .from(Risk, 'risk');
      }, 'target_impact')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`AVG(risk.target_likelihood)`, 'target_likelihood')
          .where('risk.program_id = Program.id')
          .from(Risk, 'risk');
      }, 'target_likelihood')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`AVG(risk.current_impact)`, 'current_impact')
          .where('risk.program_id = Program.id')
          .from(Risk, 'risk');
      }, 'current_impact')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(
            `AVG(risk.current_likelihood)`,
            'current_likelihood',
          )
          .where('risk.program_id = Program.id')
          .from(Risk, 'risk');
      }, 'current_likelihood')
      .execute();
  }
  @Roles()
  @Get('categories/levels')
  @ApiCreatedResponse({
    description: '',
    type: [getCategoriesLevels],
  })
  getCategories() {
    return this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id is null')
      .andWhere('program.archived = :archived', { archived: false })

      .addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`AVG(risk.target_level)`, 'target_level')
          .where('risk.category_id = risk_category.id')
          .from(Risk, 'risk');
      }, 'target_level')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`AVG(risk.current_level)`, 'current_level')
          .where('risk.category_id = risk_category.id')
          .from(Risk, 'risk');
      }, 'current_level')
      .groupBy('risk_category.id')

      .execute();
  }
  @Roles()
  @Get('categories/count')
  @ApiCreatedResponse({
    description: '',
    type: [getCategoriesCount],
  })
  getcategoeis() {
    return this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id is null')
      .andWhere('program.archived = :archived', { archived: false })

      .addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect((subQuery) => {
        return subQuery
          .from(Risk, 'risk')
          .where('risk.original_risk_id is null')
          .leftJoin('program', 'program', 'program.id = risk.program_id')
          .andWhere('program.archived = :archived', { archived: false })
          .addSelect(`COUNT(risk.id)`, 'total_count')
          .andWhere('risk.category_id = risk_category.id')          
      }, 'total_count')
      .groupBy('risk_category.id')

      .execute();
  }
  @Roles()
  @Get('categories/groups/count')
  @ApiCreatedResponse({
    description: '',
    type: [getCategoriesGroupsCount],
  })
  getCategoriesGroups() {
    return this.dataSource
      .createQueryBuilder()
      .from('category_group', 'category_group')
      .addSelect('category_group.id', 'id')
      .addSelect('category_group.name', 'name')
      .leftJoin('risk_category','risk_category','risk_category.category_group_id = category_group.id ')
      .leftJoin('risk', 'risk', 'risk.category_id = risk_category.id')
      .leftJoin('program', 'program', 'program.id = risk.program_id')
      .where('risk.original_risk_id is null')
      .andWhere('program.archived = :archived', { archived: false })
      .addSelect((subQuery) => {
        return subQuery
          .from(Risk, 'risk')
          .where('risk.original_risk_id is null')
          .leftJoin('program', 'program', 'program.id = risk.program_id')
          .andWhere('program.archived = :archived', { archived: false })
          .addSelect(`COUNT(risk.id)`, 'total_count')
          .andWhere('risk.category_id = risk_category.id')
      }, 'total_count')
      .addGroupBy('id')
      .execute();
  }
  @Roles()
  @Get('action_areas/count')
  @ApiCreatedResponse({
    description: '',
    type: [getCategoriesGroupsCount],
  })
  getActionAreasCount() {
    return this.dataSource
      .createQueryBuilder()
      .from('action_area', 'action_area')
      .addSelect('action_area.id', 'id')
      .addSelect('action_area.name', 'name')
      .addSelect('COUNT(risk.id)', 'total_count')
      .leftJoin('program','program','program.action_area_id = action_area.id')
      .where('program.archived = :archived', { archived: false })
      .leftJoin('risk','risk','risk.program_id = program.id')
      .addGroupBy('action_area.id')
      .execute();
  }
  @Roles()
  @Get('status')
  @ApiCreatedResponse({
    description: '',
    type: [getDashboardStatus],
  })
  getstatus() {
    return this.dataSource
    .createQueryBuilder()
    .from('mitigation_status', 'mitigation_status')

    .leftJoin('mitigation', 'mitigation', 'mitigation.mitigation_status_id = mitigation_status.id')
    .leftJoin('risk', 'risk', 'risk.id = mitigation.risk_id')
    .leftJoin('program', 'program', 'program.id = risk.program_id')
    .where('risk.original_risk_id IS NULL')
    .andWhere('program.archived = :archived', { archived: false })

    .addSelect('mitigation_status.id', 'id')
    .addSelect('mitigation_status.title', 'title')
    .addSelect((subQuery) => {
      return subQuery
        .from(Mitigation, 'mitigation')
        .leftJoin('risk', 'risk', 'risk.id = mitigation.risk_id')
        .where('risk.original_risk_id IS NULL')
        .leftJoin('program', 'program', 'program.id = risk.program_id')
        .andWhere('program.archived = :archived', { archived: false })

        .select('COUNT(mitigation.id)', 'total_actions')

        .andWhere('mitigation_status.id = mitigation.mitigation_status_id')
    }, 'total_actions')
    .groupBy('mitigation_status.id')

    .execute();
  }

  @Get('risks/:id')
  risksCharts(@Param('id') id: number) {
    return this.riskService.riskRepository.find(
      {
        where: { program_id: id, redundant: false },
      }
    );
  }


  @Get('organizations')
  async getSunburstData() {
    const organizations = await this.iniService.organizationRepo.find();

    const programs = await this.iniService.programRepository.find({
      where: {
        parent_id: IsNull(),
        archived: false,
      },
      relations: ['risks', 'organizations'],
    });


    const finalData = organizations.map((mainOrg) => ({
      code: mainOrg.code,
      name: mainOrg.name,
      acronym: mainOrg.acronym,
      programs: programs
        .filter((program) => program.organizations.some((org) => org.code === mainOrg.code)) 
        .map((program) => ({
          id: program.id,
          official_code: program.official_code,
          name: program.name,
          risks: program.risks.map((risk) => ({
            id: risk.id,
            name: risk.title,
          })),
        })),
    }));
  

    return finalData
  }
}
