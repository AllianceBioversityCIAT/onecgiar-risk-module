import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { getCategoriesLevels, getCategoriesCount, getInitiativeScor, getCategoriesGroupsCount, getDashboardStatus } from 'DTO/dashboard.dto';
import { getInitiative } from 'DTO/initiative.dto';
import { Initiative } from 'entities/initiative.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Risk } from 'entities/risk.entity';
import { InitiativeService } from 'src/initiative/initiative.service';
import { DataSource, ILike, IsNull } from 'typeorm';

@ApiTags('Dashboard')
@Controller('Dashboard')
export class DashboardController {
  constructor(private dataSource: DataSource,private iniService: InitiativeService) {}

  
  @Get('initiative/details')
  @ApiCreatedResponse({
    description: '',
    type: [getInitiative],
  })
  getInitiativeDetails() {
    return this.iniService.iniRepository.find({
        where: {
          parent_id: IsNull(),
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
  @Get('initiative/score')
  @ApiCreatedResponse({
    description: '',
    type: [getInitiativeScor],
  })
  getInitiativeScore() {
    return this.dataSource
      .createQueryBuilder()
      .from('initiative', 'initiative')
      .addSelect('initiative.id', 'id')
      .addSelect('initiative.status', 'status')
      .where('initiative.parent_id is null')
      .addSelect('initiative.official_code', 'official_code')
      .addSelect('initiative.name', 'name')
      .innerJoin(Risk,'risk','risk.initiative_id = initiative.id')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`AVG(risk.target_impact)`, 'target_impact')
          .where('risk.initiative_id = initiative.id')
          .from(Risk, 'risk');
      }, 'target_impact')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`AVG(risk.target_likelihood)`, 'target_likelihood')
          .where('risk.initiative_id = initiative.id')
          .from(Risk, 'risk');
      }, 'target_likelihood')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`AVG(risk.current_impact)`, 'current_impact')
          .where('risk.initiative_id = initiative.id')
          .from(Risk, 'risk');
      }, 'current_impact')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(
            `AVG(risk.current_likelihood)`,
            'current_likelihood',
          )
          .where('risk.initiative_id = initiative.id')
          .from(Risk, 'risk');
      }, 'current_likelihood')
      .execute();
  }

  @Get('categories/levels')
  @ApiCreatedResponse({
    description: '',
    type: [getCategoriesLevels],
  })
  getCategories() {
    return this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
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

      .execute();
  }
  @Get('categories/count')
  @ApiCreatedResponse({
    description: '',
    type: [getCategoriesCount],
  })
  getcategoeis() {
    return this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
      .addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`COUNT(risk.id)`, 'total_count')
          .where('risk.category_id = risk_category.id')
          .from(Risk, 'risk');
      }, 'total_count')
      .execute();
  }

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
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`COUNT(risk.id)`, 'total_count')
          .where('risk.category_id = risk_category.id')
          .from(Risk, 'risk');
      }, 'total_count')
      .addGroupBy('id')
      .execute();
  }

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
      .leftJoin('initiative','initiative','initiative.action_area_id = action_area.id')
      .leftJoin('risk','risk','risk.initiative_id = initiative.id')
      .addGroupBy('action_area.id')
      .execute();
  }

  @Get('status')
  @ApiCreatedResponse({
    description: '',
    type: [getDashboardStatus],
  })
  getstatus() {
    return this.dataSource
      .createQueryBuilder()
      .from('mitigation_status', 'mitigation_status')
      .addSelect('mitigation_status.id', 'id')
      .addSelect('mitigation_status.title', 'title')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`COUNT(mitigation.id)`, 'total_actions')
          .where('mitigation_status.id = mitigation.mitigation_status_id')
          .from(Mitigation, 'mitigation');
      }, 'total_actions')

      .execute();
  }
}
