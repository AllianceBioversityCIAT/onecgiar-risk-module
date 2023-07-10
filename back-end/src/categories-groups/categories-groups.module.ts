import { Module } from '@nestjs/common';
import { CategoriesGroupsController } from './categories-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryGroup } from 'entities/categories-groups';

@Module({
  controllers: [CategoriesGroupsController],
  imports: [TypeOrmModule.forFeature([CategoryGroup])]
})
export class CategoriesGroupsModule {}
