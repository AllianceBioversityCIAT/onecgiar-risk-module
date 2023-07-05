import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  getInitiativeScore() {
    return this.dataSource
      .createQueryBuilder()
      .from('initiative', 'initiative')
      .addSelect('initiative.id', 'id')
      .addSelect('initiative.status', 'status')
      .where('initiative.parent_id is null')
      .addSelect('initiative.official_code', 'official_code')
      .addSelect('initiative.name', 'name')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`ROUND(AVG(risk.target_impact))`, 'target_impact')
          .where('risk.initiative_id = initiative.id')
          .from(Risk, 'risk');
      }, 'target_impact')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`ROUND(AVG(risk.target_likelihood))`, 'target_likelihood')
          .where('risk.initiative_id = initiative.id')
          .from(Risk, 'risk');
      }, 'target_likelihood')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`ROUND(AVG(risk.current_impact))`, 'current_impact')
          .where('risk.initiative_id = initiative.id')
          .from(Risk, 'risk');
      }, 'current_impact')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(
            `ROUND(AVG(risk.current_likelihood))`,
            'current_likelihood',
          )
          .where('risk.initiative_id = initiative.id')
          .from(Risk, 'risk');
      }, 'current_likelihood')

      .execute();
  }

  @Get('categories/levels')
  getCategories() {
    return this.dataSource
      .createQueryBuilder()
      .from('risk_category', 'risk_category')
      .addSelect('risk_category.id', 'id')
      .addSelect('risk_category.title', 'title')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`ROUND(AVG(risk.target_level))`, 'target_level')
          .where('risk.category_id = risk_category.id')
          .from(Risk, 'risk');
      }, 'target_level')
      .addSelect((subQuery) => {
        return subQuery
          .addSelect(`ROUND(AVG(risk.current_level))`, 'current_level')
          .where('risk.category_id = risk_category.id')
          .from(Risk, 'risk');
      }, 'current_level')

      .execute();
  }
  @Get('categories/count')
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

  @Get('status')
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
