import { Module } from '@nestjs/common';
import { VariablesController } from './variables.controller';
import { VariablesService } from './variables.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variables } from 'entities/variables.entity';

@Module({
  controllers: [VariablesController],
  imports: [TypeOrmModule.forFeature([Variables])],
  providers: [VariablesService],
  exports: [VariablesService],
})
export class VariablesModule {}
