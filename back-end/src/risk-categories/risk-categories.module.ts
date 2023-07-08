import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskCategory } from 'entities/risk-category.entity';
import { SharedModule } from 'src/shared/shared.module';
import { RiskCategoriesController } from './risk-categories.controller';
import { RiskCategoriesService } from './risk-categories.service';
import { CategoryGroup } from 'entities/categories-groups';

@Module({
  controllers: [RiskCategoriesController],
  imports: [SharedModule, TypeOrmModule.forFeature([RiskCategory,CategoryGroup])],
  providers: [RiskCategoriesService],
})
export class RiskCategoriesModule {}
