import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskCategory } from 'entities/risk-category.entity';
import { SharedModule } from 'src/shared/shared.module';
import { RiskCategoriesController } from './risk-categories.controller';
import { RiskCategoriesService } from './risk-categories.service';
import { CategoryGroup } from 'entities/categories-groups';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  controllers: [RiskCategoriesController],
  imports: [SharedModule, TypeOrmModule.forFeature([RiskCategory,CategoryGroup]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '30d'},
  })],
  providers: [RiskCategoriesService],
})
export class RiskCategoriesModule {}
